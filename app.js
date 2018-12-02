console.clear()

const hosts = [

]

const secureHeaders = [
]

const fs = require('fs')
const dns = require('dns');
const unirest = require('unirest')
const json2xls = require('json2xls')

let responseHeader = new Object()
let xlsxFormatRow = new Array()
let xlsxFormatSubRow = new Object()

var i = 1

const GetQuery = function(host, callback) {

    dns.lookup(host, (err, ip) => {

      this.req = unirest('GET', `https://${host}`)
      this.req.headers({})
      this.req.timeout(1300)
      this.req.strictSSL(false)
      this.req.end((res, code) => callback(ip, res.headers, res.ok))

    })

}

const SearchKey = (headers, head) => {
  return Object.keys(headers).includes(head.toLowerCase())
}

const PercentLine = (a, b, print = true, clear = true) => {

  if (clear) console.clear()
  if (print) console.log(`${b} out of ${a} - ${Math.round((b / a) * 100)}%`)
  if (a === b) return true

}

hosts.forEach((host) => GetQuery(host, (ip, headers, status) => {

  responseHeader[host] = new Object()

  if (headers === undefined) {

    responseHeader[host] = 'No response from server. Status: ' + status

    xlsxFormatRow.push({
      '№': Object.keys(responseHeader).length,
      'Host': host,
      'IP': ip,
      'Headers': 'No response from server',
      'Status': 'Unknown'
    })

  } else {

    xlsxFormatSubRow = {
      headers: '',
      status: ''
    }

    secureHeaders.forEach((head) => {

      if (SearchKey(headers, head)) responseHeader[host][head] = 'Yes'
      else responseHeader[host][head] = 'No'

      xlsxFormatSubRow.headers += head + '\n'
      xlsxFormatSubRow.status += responseHeader[host][head] + '\n'

    })

    xlsxFormatRow.push({
      '№': Object.keys(responseHeader).length,
      'Host': host,
      'IP': ip,
      'Headers': xlsxFormatSubRow.headers,
      'Status': xlsxFormatSubRow.status
    })

  }

  if (PercentLine(hosts.length, Object.keys(responseHeader).length)) {

    console.log(responseHeader)

    fs.writeFileSync('data.xlsx', json2xls(xlsxFormatRow), 'binary')

  }

}));
