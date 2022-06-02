let Table1 = document.getElementById("table1")
let Table2 = document.getElementById("table2")
const backButton = document.getElementById('backSubmit')

async function GetLogs()
{
    fetch('/Logs/GetMatchLogs').then((data) => data.json()).then((data) => {
        let trh = document.createElement('tr')
        for(let i = 0; i < 4; i++)
        {
            let th = document.createElement('th')
            th.innerHTML = data[i][0]
            trh.appendChild(th)
        }
        Table1.appendChild(trh)
        
        for(let i = 0; i < data.length/4; i++)
        {
            let tr = document.createElement('tr')
            for(let j = 0; j < 4; j++)
            {
                let td = document.createElement('td')
                td.innerHTML = data[4*i+j][1]
                tr.appendChild(td)
            }
            Table1.appendChild(tr)
        }
    })

    fetch('/Logs/GetActionLogs').then((data) => data.json()).then((data) => {
        let trh = document.createElement('tr')
        for(let i = 0; i < 4; i++)
        {
            let th = document.createElement('th')
            th.innerHTML = data[i][0]
            trh.appendChild(th)
        }
        Table2.appendChild(trh)
        
        for(let i = 0; i < data.length/4; i++)
        {
            let tr = document.createElement('tr')
            for(let j = 0; j < 4; j++)
            {
                let td = document.createElement('td')
                td.innerHTML = data[4*i+j][1]
                tr.appendChild(td)
            }
            Table2.appendChild(tr)
        }
    })

}

backButton.addEventListener('click', function(){
    fetch('/Logs/Back').then((data) => {
        window.location.replace(data.url)
    })
})

GetLogs().then((data) => {
    
})