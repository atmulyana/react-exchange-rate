const val = (name, rate) => ({name, rate});

const currencies = {
    USD: val('United States Dollar', 1),
    IDR: val('Indonesian Rupiah', 14410.45),
    EUR: val('Euro', 0.85694),
    GBP: val('British Pound', 0.75894),
    SGD: val('Singapore Dollar', 1.36637),
    JPY: val('Japanese Yen', 110.974),
    CAD: val("Canadian Dollar", 1.24),
    CHF: val('Swiss Franc', 0.92),
    INR: val('Indian Rupee', 74.96),
    MYR: val('Malaysian Ringgit', 4.15),
    KRW: val('South Korean Won', 1167.42),
}

export const refreshRate = () => {
    const curCodes = Object.keys(currencies),
          baseCode = curCodes[0],
          apiUrl = 'https://api.currencylayer.com/convert?access_key=78043916d97d6372736025516e52e69a&from=USD&amount=1&to=';
    currencies[baseCode].rate = 1;
    
    const httpReqs = [];
    for (let i = 1; i < curCodes.length; i++) {
        let code = curCodes[i];
        httpReqs.push(
            fetch(apiUrl + code, {method: 'GET'}).then(response => {
                if (response.ok) return response.json();
                throw new Error('Respnse not OK');
            }).then(data => {
                currencies[code].rate = parseFloat(data.success && data.result) || 0.0;
            }).catch(() => {
                currencies[code].rate = 0;
            })
        );
    }
    return Promise.all(httpReqs);
}

export default currencies;