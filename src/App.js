import React from 'react';
import numeral from 'numeral';
import NumberFormat from "react-number-format";
import './App.css';
import currencies from './currencies';

const INIT_VALUE = 10;
const BASE_CURRENCY = Object.keys(currencies)[0];

function App() {
    const [value, setValue] = React.useState(INIT_VALUE);
    const [list, setList] = React.useState(['IDR', 'EUR', 'GBP', 'SGD']);
    const [isAdding, setAdding] = React.useState(false);
    const notListed = Object.keys(currencies).filter(c => !list.includes(c) && c != BASE_CURRENCY);

    return (
    <div class="row d-flex justify-content-center">
        <div class="App">
            <div class="section">
                <div class="fs-7 fw-bold fst-italic">{BASE_CURRENCY} - {currencies[BASE_CURRENCY].name}</div>
                <div class="input-group">
                    <span class="input-group-text bg-white border-0 fw-bold text-start ps-0">{BASE_CURRENCY}</span>
                    <NumberFormat
                        className="form-control border-0 fw-bold text-end"
                        defaultValue={INIT_VALUE}
                        displayType="input"
                        thousandSeparator={true}
                        decimalScale={4}
                        fixedDecimalScale={true}
                        allowNegative={false}
                        onValueChange={val => setValue(val.floatValue)}
                    />
                </div>
            </div>
            <div class="separator"></div>
            <div class="section overflow-auto content">
                {list.map(code => <ListItem key={code} code={code} baseValue={value} 
                    remove={() => {
                        const idxCode = list.indexOf(code);
                        if (idxCode >= 0) {
                            setList(list.filter((code, idx) => idx != idxCode));
                        }
                    }}
                />)}

                {notListed.length > 0 && (isAdding
                    ? <div class="input-group">
                        <select class="form-select">
                            {notListed.map(code => <option key={code}>{code}</option>)}
                        </select>
                        <button class="btn border" type="button"
                            onClick={event => {
                                setAdding(false);
                                setList(list.concat(event.target.previousSibling.value));
                            }}>Submit</button>
                    </div>
                    
                    : <button type="button" class="btn border text-start" style={{width: '100%'}}
                        onClick={() => setAdding(true)}>{'(+) Add More Currencies'}</button>
                )}
            </div>
        </div>
    </div>
    );
}

const formatAmount = amt => {
    amt = numeral(amt).format('0,000.0000');
    if (amt.endsWith('0')) amt = amt.substring(0, amt.length-1);
    if (amt.endsWith('0')) amt = amt.substring(0, amt.length-1);
    return amt;
}

function ListItem({code, baseValue, remove}) {
    const baseCur = currencies[BASE_CURRENCY],
          cur = currencies[code],
          value = baseValue / baseCur.rate * cur.rate;
    return <div class="input-group mb-3">
        <div class="form-control">
            <div class="row">
                <div class="col col-1">{code}</div>
                <div class="col col-11 text-end">{formatAmount(value)}</div>
            </div>
            <div class="fs-7 fw-bold fst-italic">{code} - {cur.name}</div>
            <div class="fs-7 fst-italic">1 {BASE_CURRENCY} = {code} {formatAmount(cur.rate / baseCur.rate)}</div>
        </div>
        <span role="button" class="input-group-text bg-white" onClick={() => remove()}>(-)</span>
    </div>
}

export default App;
