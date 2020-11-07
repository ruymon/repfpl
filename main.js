function pageLoad () {
    document.getElementById('outputPanel').classList.add("d-none");
    document.getElementById('searchInput').onkeypress = () => searchCallsign();

};


let pages;
let currentPage = 0;

let data;

const company = {
    'AZU': '/logos/AZU.png', // Logo Azul Linhas Aereas
    'GLO': '/logos/GLO.png', // Logo Gol Linhas Aereas
    'PAM': '/logos/PAM.png', // Logo MAP linhas Aereas
    'PTB': '/logos/PTB.png', // Logo Passaredo Linhas Aereas
    'TAM': '/logos/TAM.png', // Logo LaTam Linhas Aereas
    'TTL': '/logos/TTL.png', // Logo Total Linhas Aereas
    'SID': '/logos/SID.png', // Logo Sideral Linhas Aereas
    'LAP': '/logos/LAP.png', // Logo Linhas Aereas Paraguaias
};


const getApi = (params) => `https://mach-api.herokuapp.com/flights?` + params;

async function handleButton() {
    const deptIcao = document.getElementById('deptIcao').value;
    const arrIcao = document.getElementById('arrIcao').value;
    const ciaIcao = document.getElementById('ciaIcao').value;

    const outputData = await getFlights({departureIcao:deptIcao, arrivalIcao:arrIcao, company:ciaIcao, offset:currentPage});
    
    showData(outputData);
}

async function getFlights({company, departureIcao, arrivalIcao, offset}) {

    let params = ``;

    if (company != '') params += `&company=${company}`;
    if (departureIcao != '') params += `&departureIcao=${departureIcao}`;
    if (arrivalIcao != '') params += `&arrivalIcao=${arrivalIcao}`;

    if (offset != null) params += `&offset=${offset}`;


    let response;

    await fetch(getApi(params))
        .then(res => res.json())
        .then(data => response = data)

    pages = response.count / 15; // Valor de páginas baseado no número de objetos da API.

    data = response;

    return response;
    


};

function getLogo (name) {
    const logo = company[name];
    return logo;
}

function showData (data) {

    document.getElementById('outputPanel').classList.remove("d-none");
    const dataResponse = document.getElementById('outputTable');
    dataResponse.innerHTML = '';
    console.log(data);

    data.items.map((item, index) => {
        dataResponse.innerHTML += Item(item);

    });

};


function searchCallsign () {
    const searchedText = document.getElementById('searchInput').value.toUpperCase();

    const dataResponse = document.getElementById('outputTable');
    dataResponse.innerHTML = '';

    data.items.filter(flight => flight.callsign.indexOf(searchedText) > -1).forEach(flight => dataResponse.innerHTML += Item(flight))
};

function Item (item) {
    return `
    <tr>
    <td><img src="${getLogo(item.company)}"/></td>
    <td><samp>${item.callsign}</samp></td>
    <td><samp>${item.aircraft.icaoCode}</samp></td>
    <td><a class="badge badge-info text-decoration-none" href="https://aisweb.decea.gov.br/?i=aerodromos&codigo=${item.departureIcao}">${item.departureIcao}</a></td>
    <td><a class="badge badge-info text-decoration-none" href="https://aisweb.decea.gov.br/?i=aerodromos&codigo=${item.arrivalIcao}">${item.arrivalIcao}</a></td>
    <td><samp>${item.route}</samp></td> 
    <td><a class="badge badge-success" type="button" onclick="moreInfo('${item.id}')">More Info</a></td>
    </tr>
    `
};
function moreInfo (id) {
    const flightData = data.items.find(flight => flight.id === id)

    $("#moreInfoModal").modal();

    // Modal Header 
    document.getElementById('modalHeaderTitle').innerHTML = flightData.callsign;
    document.getElementById('modalHeaderDeparture').innerHTML = flightData.departureIcao;
    document.getElementById('modalHeaderArrival').innerHTML = flightData.arrivalIcao;

    // Modal info Days Of Week
    //document.getElementById('modalDayofWeek').innerHTML = flightData.weekdays;
    
    // Modal info Remarks
    document.getElementById('modalRemarks').innerHTML = flightData.remarks;
};


// Pagination Functions

function nextPage () {
    if(currentPage === pages) return;
    currentPage ++;
    handleButton();  
};

function previousPage () {
    if(currentPage != 0) {
        currentPage --;
        handleButton();
    };
};

function startPage () {
    if(currentPage != 0) {
        currentPage = 0;
        handleButton();  
    };
};

function endPage () {
    if(currentPage === pages) return;
    currentPage = pages;
    handleButton();  
};