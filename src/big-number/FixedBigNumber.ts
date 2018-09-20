import Big from "big.js";

type FixedBigNumberSource = number | string | FixedBigNumber;

/**
 * Represents a number with a fixed amount of decimals.
 */
export class FixedBigNumber {
    /**
     * The interal Big number.
     */
    private big: Big;
    /**
     * The amount of decimals.
     */
    private decimals: number;
    /**
     * True if the internal Big number is invalid. This happens if the passed
     * input string is of an invalid format.
     */
    private invalidNumber: boolean = false;

    constructor(number: string|number|Big, decimals: number) {
        try {
            this.big = Big(number);
        }
        catch(ex) {
            this.invalidNumber = true;
        }
        
        this.decimals = decimals;
    }

    getDecimals(): number {
        return this.decimals;
    }

    /**
     * Converts the given FixedBigNumberSource to a value big.js understands.
     */
    private getSourceValue(source: FixedBigNumberSource): any {
        if(source instanceof FixedBigNumber)
            return source.big;
        else
            return source;
    }

    /**
     * Returns true if this FixedBigNumber is valid.
     * 
     * A FixedBigNumber is invalid if the amount of decimals exceeds the defined amount of decimals.
     */
    isValid(): boolean {
        return !this.invalidNumber &&
                new FixedBigNumber(this.toFixed(this.decimals), this.decimals).eq(this);
    }

    /**
     * Returns true if the value of this FixedBigNumber equals the value of n, otherwise returns false.
     *
     * @throws `NaN` if n is invalid.
     */
    eq(n: FixedBigNumberSource): boolean {
        return this.big.eq(this.getSourceValue(n));
    }
    /**
     * Returns true if the value of this FixedBigNumber is greater than the value of n, otherwise returns false.
     *
     * @throws `NaN` if n is invalid.
     */
    gt(n: FixedBigNumberSource): boolean {
        return this.big.gt(this.getSourceValue(n));
    }
    /**
     * Returns true if the value of this FixedBigNumber is greater than or equal to the value of n, otherwise returns false.
     *
     * @throws `NaN` if n is invalid.
     */
    gte(n: FixedBigNumberSource): boolean {
        return this.big.gte(this.getSourceValue(n));
    }
    /**
     * Returns true if the value of this FixedBigNumber is less than the value of n, otherwise returns false.
     *
     * @throws `NaN` if n is invalid.
     */
    lt(n: FixedBigNumberSource): boolean {
        return this.big.lt(this.getSourceValue(n));
    }
    /**
     * Returns true if the value of this FixedBigNumber is less than or equal to the value of n, otherwise returns false.
     *
     * @throws `NaN` if n is invalid.
     */
    lte(n: FixedBigNumberSource): boolean {
        return this.big.lte(this.getSourceValue(n));
    }

    /**
     * Returns a FixedBigNumber number whose value is the value of this FixedBigNumber number times n.
     *
     * @throws `NaN` if n is invalid.
     */
    mul(n: FixedBigNumberSource): FixedBigNumber {
        return new FixedBigNumber(this.big.mul(this.getSourceValue(n)), this.decimals);
    }

    /**
     * Returns a FixedBigNumber number whose value is the value of this FixedBigNumber number divided by n.
     *
     * If the result has more fraction digits than is specified by Big.DP, it will be rounded to Big.DP decimal places using rounding mode Big.RM.
     *
     * @throws `NaN` if n is invalid.
     * @throws `±Infinity` on division by zero.
     * @throws `NaN` on division of zero by zero.
     */
    div(n: FixedBigNumberSource): FixedBigNumber {
        return new FixedBigNumber(this.big.div(this.getSourceValue(n)), this.decimals);
    }

    /**
     * Returns a FixedBigNumber number whose value is the value of this FixedBigNumber number plus n.
     *
     * @throws `NaN` if n is invalid.
     */
    add(n: FixedBigNumberSource): FixedBigNumber {
        return new FixedBigNumber(this.big.add(this.getSourceValue(n)), this.decimals);
    }
    /**
     * Returns a FixedBigNumber number whose value is the value of this FixedBigNumber number minus n.
     *
     * @throws `NaN` if n is invalid.
     */
    sub(n: FixedBigNumberSource): FixedBigNumber {
        return new FixedBigNumber(this.big.sub(this.getSourceValue(n)), this.decimals);
    }

    toFixed(dp?: number): string {
        return this.big.toFixed(dp);
    }

    toPrecision(sd?: number): string {
        return this.big.toPrecision(sd);
    }

    toString(): string {
        return this.big.toString();
    }

    /**
     * Returns a BigInteger string representation of this FixedBigNumber.
     * 
     * Example: say you have the number 100.123 with 8 decimals the following value
     * will be returned '10012300000'. 
     * 
     * Essentially the dot is removed and the end is padded to satisfy the decimal constraint
     * of this FixedBigNumber.
     */
    toBigIntegerString(): string {
        // First get the string version of the big number.
        // Note how we do decimals+1. We do this to prevent rounding issues.
        let numberString = this.big.toFixed(this.decimals + 1);

        let dotIndex = numberString.indexOf(".");

        // If no dot is found we simply pad the numberString until it has the correct amount of decimals
        if(dotIndex == -1)
            return FixedBigNumber.padStringEnd(numberString, "0", numberString.length + this.decimals);

        // Split the number string at the location of the dot
        let beforeDot = numberString.substr(0, dotIndex);
        let afterDot = numberString.substr(dotIndex + 1);

        afterDot = afterDot.substr(0, this.decimals);

        // Pad the 'after the dot' part until it has the correct amount of decimals
        afterDot = FixedBigNumber.padStringEnd(afterDot, "0", this.decimals);

        // Merge the 'before the dot' and 'after the dot' back together (minus the dot this time)
        return beforeDot + afterDot;
    }

    /**
     * Constructs a FixedBigNumber from the given BigInteger string and the amount of decimals.
     * 
     * Example: you pass the string "100000024" and decimals is 5 the constructed FixedBigNumber
     * will be 1000.00024
     */
    static fromBigIntegerString(bigIntegerString: string, decimals: number): FixedBigNumber {
        bigIntegerString = FixedBigNumber.insertDecimalDot(bigIntegerString, decimals);

        return new FixedBigNumber(Big(bigIntegerString), decimals);
    }

    /**
     * Inserts a dot (e.g. '.') at the specified index in the given string.
     * The index is counted from the right and not from left.
     * @param numberAsString 
     * @param dotIndex 
     */
    private static insertDecimalDot(numberAsString: string, dotIndex: number): string {
        // Pad string if too short
        numberAsString = FixedBigNumber.padStringStart(numberAsString, "0", dotIndex);

        // Insert dot
        return numberAsString.substr(0, numberAsString.length - dotIndex) + "." + numberAsString.substr(numberAsString.length - dotIndex);
    }

    /**
     * Pads the start of the given string with the pad string until the target length has been reached or exceeded.
     * @param str 
     * @param pad 
     * @param targetLength 
     */
    private static padStringStart(str: string, pad: string, targetLength: number): string {
        while(str.length < targetLength)
            str = pad + str;

        return str;
    }

    /**
     * Pads the end of the given string with the pad string until the target length has been reached or exceeded.
     * @param str 
     * @param pad 
     * @param targetLength 
     */
    private static padStringEnd(str: string, pad: string, targetLength: number): string {
        while(str.length < targetLength)
            str += pad;

        return str;
    }
}