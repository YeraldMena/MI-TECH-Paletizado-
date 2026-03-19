const fs = require('fs');

const data = fs.readFileSync('err2.json', 'utf8');
const jsonStr = data.substring(data.indexOf('({') + 1, data.lastIndexOf('})') + 1);
const obj = JSON.parse(jsonStr);

let allErrorsData = [];
obj.table.rows.forEach(r => {
    let c = r.c;
    if (!c || !c[9] || c[9].v === null) return;
    
    let dateVal = c[1] && c[1].f ? c[1].f.split(' ')[0] : (c[1] && c[1].v ? c[1].v : 'N/A');
    let desc = c[9].v.toString().trim();
    let tipoVal = c[11] && c[11].v ? c[11].v.toString().trim() : '';
    
    if (desc !== "" && desc !== "-") {
        allErrorsData.push({ fecha: dateVal, error: desc, tipo: tipoVal });
    }
});

console.log("All errors match 2/25/2026 Non-HV:");
let filteredErrorRows = allErrorsData.filter(row => row.fecha === '2/25/2026');

filteredErrorRows = filteredErrorRows.filter(row => {
    let text = row.tipo.toLowerCase();
    return !text.includes('hv') && !text.includes('high value');
});

let errorCounts = {};
filteredErrorRows.forEach(row => {
    let e = row.error;
    errorCounts[e] = (errorCounts[e] || 0) + 1;
});

let sortedErrors = Object.keys(errorCounts).map(k => ({ label: k, count: errorCounts[k] })).sort((a,b) => b.count - a.count);
console.log(sortedErrors);
