const { ajax } = require('../src/jQueryShim');

let open;

const createXHRmock = () => {
    open = jest.fn();

    const xhrMockClass = () => ({
            open: open,
            send: jest.fn().mockImplementation(function(){}),
            status: "200",
            setRequestHeader: jest.fn().mockImplementation(function(a, b){})            ,
            response: ''
    });

    window.XMLHttpRequest = jest.fn().mockImplementation(xhrMockClass);
}

const cases = [
    {url: 'test?_=0', name: 'with only cacheBuster query', request: 'test?_=1'}, 
    {url: 'test', name: 'with just URL', request: 'test?_=1'}, 
    {url: 'test?dummy=d', name: 'with existing query', request: 'test?dummy=d&_=1'}, 
    {url: 'test?dummy=d&_=0', name: 'with query and cachebuster', request: 'test?dummy=d&_=1'}]
    
    cases.forEach(t => 
        test(`Test that cacheBuster works ${t.name}`, () => {
            jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1);
            
            createXHRmock();

            const options = {url: t.url, xhrFields: {withCredentials: true}, data: {data: {}}, type: "GET"}
            
            ajax(options)

            expect(open).toBeCalledWith('GET', t.request);    
    })
);