## A note about UglifyJS

This library does not play nicely with the `typeofs` compress option of [UglifyJS](https://www.npmjs.com/package/uglify-js).

When this compression option is enabled an error will be thrown when generating a Merkle Tree.

If you are using UglifyJS either do not uglify/compress this library or disable this option.

A minimal working configuration file for UglifyJS could look like this:

```
{
    "compress": {
        "typeofs": false
    }
}
```

