const qiniuUploader = require('qiniu-qupload')
const path = require('path')
const qnConf = {
  /* eslint-disable  */
  "ak"            : "t7_qHQ0hDd4XYLISmC5lyf0xyhQqylmipAFB3Qxm",
  "sk"            : "2tfy3CZKct0EEdZr-i9peg4WlIGtSj8b3Goip-48",
  "src_dir"       : `${path.resolve(process.cwd(), './dist/static').replace(/\\/g, '\\')}`,
  "bucket"        : "movie-chat",
  "key_prefix"    : `${process.env.npm_package_name}/static/`,
  "overwrite"     : true,
  "rescan_local"  : true,
  "log_file"      : "qnupload.log",
  "file_type"     : 0
}
qiniuUploader(qnConf)
