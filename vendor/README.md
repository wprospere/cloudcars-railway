# vendor/

`xlsx-0.20.3.tgz` is SheetJS Community Edition 0.20.3, downloaded from the official
SheetJS CDN (https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz). The npm registry
copy of `xlsx` stops at 0.18.5, which has known security advisories (prototype
pollution, ReDoS) fixed only in the CDN releases. It is only used by
`server/invoiceImport.ts` (admin invoice import).

To upgrade, download the newer tarball from https://cdn.sheetjs.com and update the
`xlsx` entry in `package.json`.
