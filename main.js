document.body.onload = () => {
    startPoint();
}

const startPoint = () => {
    let div = document.getElementById("types");
    let text = `<option value="noselect">Type</option>`;
    Object.keys(tables).forEach(item => {
        text += `<option value="${tables[item]}">${item}</option>`
    });
    //console.log(text);
    div.innerHTML = text;

    let info = document.getElementById("info");
    text = `<option value="noselect">Person</option>`;
    fetch(`${sheetLink}/information`).then(res => {
        return res.json();
    }).then(data => {
        data = data.information;
        data.forEach(item=>{
            text += `<option value="${item.name.toLowerCase()}">${item.name}</option>`
        });
        info.innerHTML = text;
    })
}

const selectChange = (e) => {
    console.log(e);
    let value = e.selectedOptions[0].value;
    let label = e.selectedOptions[0].label;
    let person = document.getElementById("info").selectedOptions[0].value.toLowerCase();
    console.log(person);
    if(person == "noselect"){
        console.log('No person Selected');
        e.getElementsByTagName('option')[0].selected = 'selected';
        return;
    }
    //console.log(value);
    fetch(`${sheetLink}/${value}`).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        data = data[value];
        console.log(data);
        let values = [];
        data.forEach(item => {
            if(item.name.toLowerCase() == person){
                values.push(item);
            }
        });
        let text = `<br>${person.toUpperCase()} - ${label}<br><br>`;
        values.forEach(item => {
            let nt = ``;
            for(let [key,value] of Object.entries(item)){
                console.log(key);
                if(key!='id' && key!="name") nt += `${value}\t`
            }
            text += nt + `<br>`
        });
        document.getElementById("data").innerHTML = text;
        console.log(text);
    })
}

document.getElementById("info").addEventListener('change', (e)=> {
    selectChange(document.getElementById("types"));
});