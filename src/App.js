import React, { useState, useEffect } from 'react';
import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import './styles.css';

const columns = [
    { key: '0', name: 'Employee ID #1'},
    { key: '1', name: 'Employee ID #2'},
    { key: '2', name: 'Project ID'},
    { key: '3', name: 'Days worked' }
]

// create array of keys values in order to set them for rows ids
// var keysValues = columns.map(k => Object.values(k)[0]);

function App() {
    const [file, setFile] = useState();
    const [rows, setRows] = useState();

    const fileReader = new FileReader();

    useEffect(() => {
        if (file) {
            fileReader.onload = function (event) {
                const csvOutput = event.target.result;
                document.getElementsByClassName('inputContainer')[0].setAttribute('datatext', file.name);
                getEmployeesPair(csvOutput);
            };

            fileReader.readAsText(file);
        }
    }, [file]);

    const handleOnChange = (e) => {
        setFile(e.target.files[0]);
    };

    function getEmployeesPair(csvData) {
        // removing first line(defined separator for csv file)
        var firstLine = csvData.split('\n')[0];
        var d;
        if (firstLine.includes('sep=')) {
            d = csvData.split('\n').slice(1);
        }
        var data = d.map(e => e.split(','));
        var daysWorkedTogether = {};
        var pairs = {};

        for (var i = 0; i < data.length - 1; i++) {
            for (var j = i + 1; j < data.length ; j++) {
                if ((data[i][0] !== data[j][0]) && (data[i][1] === data[j][1])) {
                    // check for 'NULL\r' because of carriage returns in csv
                    const startDateFirst = new Date(data[i][2]);
                    const endDateFirst = data[i][3] === 'NULL\r' || data[i][3] === 'NULL' ? new Date() : new Date(data[i][3]);
                    const startDateSecond = new Date(data[j][2]);
                    const endDateSecond = data[j][3] === 'NULL\r' || data[j][3] === 'NULL' ? new Date() : new Date(data[j][3]);
                    if(startDateFirst < endDateSecond && endDateFirst > startDateSecond) {
                        const startDate = startDateFirst <= startDateSecond ? startDateSecond : startDateFirst;
                        const endDate = endDateFirst <= endDateSecond ? endDateFirst : endDateSecond;
                        const timeWorked = Math.abs(endDate - startDate);
                        const daysWorked = Math.ceil(timeWorked / (1000*60*60*24));
                        const xy = `${data[i][0]}${data[j][0]}`;
                        
                        if (!daysWorkedTogether[xy]) Object.assign(daysWorkedTogether, { [xy]: 0 });
                        daysWorkedTogether[xy] = daysWorkedTogether[xy] + daysWorked;
        
                        if (!pairs[xy]) Object.assign(pairs, { [xy]: [] });
                        pairs[xy] = [...pairs[xy], [data[i][0], data[j][0], data[i][1], daysWorked]];
                    }
                }
            }
        }
        if (Object.keys(pairs).length > 0) {
            var longestWorkedPair = pairs[Object.keys(daysWorkedTogether).reduce((a, b) => daysWorkedTogether[a] > daysWorkedTogether[b] ? a : b)];
            // convert to array of objects for using it to set rows
            var rowsData = longestWorkedPair.map(i => Object.assign({}, i));
            setRows(rowsData);
        } else {
            setRows([]);
            alert('There isn\'t any pair of employees who have worked together on common projects at the same time');
        }
    }

    return (
        <div className={'container'}>
            <form className={'formContainer'}>
                <div className={'inputContainer'} datatext={'Select csv file'}>
                    <input
                        type={'file'}
                        id={'csvFileInput'}
                        accept={'.csv'}
                        onChange={handleOnChange}
                    />
                </div>
            </form>
            <div className={'dataGridContainer'}>
                <DataGrid columns={columns} rows={rows != null && rows.length > 0 ? rows : []} />;
            </div>
        </div>
    );
}

export { App };
