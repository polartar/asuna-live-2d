### createColorTable.js
`node .\scripts\scale asuna\standardized_assets -w 275 -h 375`

### createColorTable.js
`node .\scripts\createColorTable.js temp/src.png temp/tgt.png -o temp/table.json`

### swap.js
`node .\scripts\swap.js temp/texture_00.png -t temp/table.json -o temp/texture_out.png`