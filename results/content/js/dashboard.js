/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9827586206896551, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Выбрать фильм, зал, время-5"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать фильм, зал, время-4"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать фильм, зал, время-7"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать фильм, зал, время-6"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать фильм, зал, время-1"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать фильм, зал, время-0"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать фильм, зал, время-3"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать фильм, зал, время-2"], "isController": false}, {"data": [0.5, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "Забранировать место-6"], "isController": false}, {"data": [1.0, 500, 1500, "Забранировать место-7"], "isController": false}, {"data": [1.0, 500, 1500, "Забранировать место-4"], "isController": false}, {"data": [1.0, 500, 1500, "Забранировать место-5"], "isController": false}, {"data": [1.0, 500, 1500, "Забранировать место-2"], "isController": false}, {"data": [1.0, 500, 1500, "Забранировать место-3"], "isController": false}, {"data": [1.0, 500, 1500, "Забранировать место-0"], "isController": false}, {"data": [1.0, 500, 1500, "Забранировать место-1"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-0"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-4"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-3"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-2"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-1"], "isController": false}, {"data": [1.0, 500, 1500, "Получить QR-код для оплаты"], "isController": false}, {"data": [1.0, 500, 1500, "Выбрать фильм, зал, время"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-8"], "isController": false}, {"data": [1.0, 500, 1500, "Забранировать место"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-7"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-6"], "isController": false}, {"data": [1.0, 500, 1500, "Переход на главную страницу-5"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28, 0, 0.0, 23.142857142857142, 2, 339, 4.5, 52.2, 210.7499999999992, 339.0, 7.707129094412331, 31.399723455133497, 8.46461687998899], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Выбрать фильм, зал, время-5", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 81.0546875, 255.859375], "isController": false}, {"data": ["Выбрать фильм, зал, время-4", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 63.50806451612903, 22.523941532258064], "isController": false}, {"data": ["Выбрать фильм, зал, время-7", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 121.58203125, 383.7890625], "isController": false}, {"data": ["Выбрать фильм, зал, время-6", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 81.0546875, 255.859375], "isController": false}, {"data": ["Выбрать фильм, зал, время-1", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 81.0546875, 257.8125], "isController": false}, {"data": ["Выбрать фильм, зал, время-0", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 411.9466145833333, 56.640625], "isController": false}, {"data": ["Выбрать фильм, зал, время-3", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 80.72916666666667, 255.53385416666666], "isController": false}, {"data": ["Выбрать фильм, зал, время-2", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 81.0546875, 256.8359375], "isController": false}, {"data": ["Test", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 164.69536537648054, 31.753978955160747], "isController": true}, {"data": ["Забранировать место-6", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 60.791015625, 191.89453125], "isController": false}, {"data": ["Забранировать место-7", 1, 0, 0.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 121.58203125, 383.7890625], "isController": false}, {"data": ["Забранировать место-4", 1, 0, 0.0, 31.0, 31, 31, 31.0, 31.0, 31.0, 31.0, 32.25806451612903, 63.50806451612903, 22.523941532258064], "isController": false}, {"data": ["Забранировать место-5", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 60.791015625, 191.89453125], "isController": false}, {"data": ["Забранировать место-2", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 60.791015625, 192.626953125], "isController": false}, {"data": ["Забранировать место-3", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 60.546875, 191.650390625], "isController": false}, {"data": ["Забранировать место-0", 1, 0, 0.0, 10.0, 10, 10, 10.0, 10.0, 10.0, 10.0, 100.0, 494.3359375, 68.26171875], "isController": false}, {"data": ["Забранировать место-1", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 60.791015625, 193.359375], "isController": false}, {"data": ["Переход на главную страницу-0", 1, 0, 0.0, 28.0, 28, 28, 28.0, 28.0, 28.0, 28.0, 35.714285714285715, 40.0390625, 21.902901785714285], "isController": false}, {"data": ["Переход на главную страницу-4", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 903.076171875, 170.41015625], "isController": false}, {"data": ["Переход на главную страницу-3", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 1483.88671875, 114.09505208333333], "isController": false}, {"data": ["Переход на главную страницу-2", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 1035.3190104166667, 114.58333333333333], "isController": false}, {"data": ["Переход на главную страницу-1", 1, 0, 0.0, 17.0, 17, 17, 17.0, 17.0, 17.0, 17.0, 58.8235294117647, 290.78584558823525, 39.98161764705882], "isController": false}, {"data": ["Получить QR-код для оплаты", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 66.015625, 138.4765625], "isController": false}, {"data": ["Выбрать фильм, зал, время", 1, 0, 0.0, 54.0, 54, 54, 54.0, 54.0, 54.0, 54.0, 18.51851851851852, 155.00217013888889, 110.94835069444444], "isController": false}, {"data": ["Переход на главную страницу-8", 1, 0, 0.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 5944.661458333333, 227.21354166666666], "isController": false}, {"data": ["Забранировать место", 1, 0, 0.0, 52.0, 52, 52, 52.0, 52.0, 52.0, 52.0, 19.230769230769234, 160.9637920673077, 115.27193509615385], "isController": false}, {"data": ["Переход на главную страницу-7", 1, 0, 0.0, 6.0, 6, 6, 6.0, 6.0, 6.0, 6.0, 166.66666666666666, 2972.4934895833335, 113.60677083333333], "isController": false}, {"data": ["Переход на главную страницу-6", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 3566.9921875, 136.328125], "isController": false}, {"data": ["Переход на главную страницу-5", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 5.807522123893805, 2.0568307522123894], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
