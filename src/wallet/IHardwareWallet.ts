import { IWallet } from "./IWallet";

export interface IHardwareWallet extends IWallet {
    type: "hardware";
}
