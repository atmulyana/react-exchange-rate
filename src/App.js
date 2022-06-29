import {useState, useEffect, useCallback} from 'react';
import numeral from 'numeral';
import NumberFormat from "react-number-format";
import LoadingIndicator from './LoadingIndicator';
import './App.css';
import currencies, {baseCurrency, refreshRate} from './currencies';

const INIT_VALUE = 10;

function App() {
    const [value, setValue] = useState(INIT_VALUE);
    const [list, setList] = useState(['IDR', 'EUR', 'GBP', 'SGD']);
    const [isAdding, setAdding] = useState(false);
    const [isRefreshing, setRefresh] = useState(true);
    const notListed = Object.keys(currencies).filter(c => !list.includes(c) && c !== baseCurrency).sort();
    const [currencyToAdd, setCurrencyToAdd] = useState(notListed[0]);
    
    const changeCurrencyToAdd = useCallback(
        event => setCurrencyToAdd(event.target.value),
        []
    );
    
    let isLoading = false; /* This variable is needed because when App is first loaded, useEffect handler is called twice.
                              Deps array [isRefreshing] doesn't help to prevent it. */
    useEffect(() => {
        if (isRefreshing && !isLoading) {
            isLoading = true;
            refreshRate().finally(() => {
                isLoading = false;
                setRefresh(false);
            });
        }
    }, [isRefreshing]);

    return (
    <div className="row d-flex justify-content-center">
        <div className="App">
            <LoadingIndicator show={isRefreshing} />
            <div className="section">
                <div className="fs-7 fw-bold fst-italic">{baseCurrency} - {currencies[baseCurrency].name}</div>
                <div className="input-group">
                    <span className="input-group-text bg-white border-0 fw-bold text-start ps-0">{baseCurrency}</span>
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
                    <button className="btn border" type="button" onClick={() => setRefresh(true)}>Refresh Rate</button>
                </div>
            </div>
            <div className="separator"></div>
            <div className="section overflow-auto content">
                {list.map(code => <ListItem key={code} code={code} baseValue={value} 
                    remove={() => {
                        const idxCode = list.indexOf(code);
                        if (idxCode >= 0) {
                            setList(list.filter((_, idx) => idx !== idxCode));
                        }
                    }}
                />)}

                {notListed.length > 0 && (isAdding
                    ? <div className="input-group">
                        <select className="form-select" value={currencyToAdd ?? notListed[0]} onChange={changeCurrencyToAdd}>
                            {notListed.map(code => <option key={code}>{code}</option>)}
                        </select>
                        <button className="btn border" type="button"
                            onClick={() => {
                                setAdding(false);
                                setList(list.concat(currencyToAdd ?? notListed[0]));
                                setCurrencyToAdd(null);
                            }}>Submit</button>
                    </div>
                    
                    : <button type="button" className="btn border text-start w-100"
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
    const baseCur = currencies[baseCurrency],
          cur = currencies[code];
    return <div className="input-group mb-3">
        <div className="form-control">
            <div className="row">
                <div className="col col-1">{code}</div>
                {cur.error 
                    ? <div className="col col-11 text-end text-danger overflow-hidden">{cur.error}</div>
                    : <div className="col col-11 text-end">{formatAmount(baseValue / baseCur.rate * cur.rate)}</div>
                }
            </div>
            <div className="fs-7 fw-bold fst-italic">{code} - {cur.name}</div>
            <div className="fs-7 fst-italic">1 {baseCurrency} = {code} {formatAmount(cur.rate / baseCur.rate)}</div>
        </div>
        <span role="button" className="input-group-text bg-white" onClick={remove}>(-)</span>
    </div>
}

export default App;
