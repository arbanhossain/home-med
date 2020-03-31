document.body.onload = () => {
    startPoint();
}

let fields = [];
let temptext = ``;
let sheet = ``;
let name = "";

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
        data.forEach(item => {
            text += `<option value="${item.name.toLowerCase()}">${item.name}</option>`
        });
        info.innerHTML = text;
    })
}

const selectChange = (e) => {
    console.log(e);
    let value = e.selectedOptions[0].value;
    let label = e.selectedOptions[0].label;
    sheet = tables[label];
    let person = document.getElementById("info").selectedOptions[0].value.toLowerCase();
    if (person == "noselect") {
        console.log('No person Selected');
        e.getElementsByTagName('option')[0].selected = 'selected';
        return;
    }
    name = person;
    //console.log(value);
    fetch(`${sheetLink}/${value}`).then(res => {
        return res.json();
    }).then(data => {
        //console.log(data);
        data = data[value];
        //console.log(data);
        let values = [];
        data.forEach(item => {
            if (item.name.toLowerCase() == person) {
                values.push(item);
            }
        });
        let text = `<br>${person.toUpperCase()} - ${label}<br><br>`;
        values.forEach(item => {
            let nt = ``;
            for (let [key, value] of Object.entries(item)) {
                //console.log(key);
                if (key != 'id' && key != "name") nt += `${value}\t`
            }
            /*<input type="button" value="Update" id="updateValue" data-id="${item.id}">*/
            text += `${nt} <input type="button" value="&times;" id="deleteValue" data-id="${item.id}" onclick="deleteValue(this)"> <br>`
        });
        fields = Object.keys(values[0]);
        temptext = text;
        document.getElementById("data").innerHTML = text;
        document.getElementById("addValues").disabled = false;
        console.log(text);
    })
}

const setupValues = () => {
    console.log("gg");
    addValue(fields, temptext, sheet);
}

const addValue = (fields, text, label) => {
    let html = ``;
    fields.forEach(item => {
        if (item != "id" && item != "name") {
            html += `<input type="text" class="values" data-key="${item}" placeholder="${item}"><br>`;
        }
    });
    console.log(html);
    document.getElementById("mainText").innerHTML = html;
}

const postData = () => {
    let url = `${sheetLink}/${sheet}`;
    console.log(url);
    let inputs = Array.from(document.getElementsByClassName('values'));
    console.log(inputs)
    let data = {};
    let sheetdata = {};
    inputs.forEach(item => {
        sheetdata[item.dataset.key] = item.value;
    })
    sheetdata["name"] = name;
    data[sheet] = sheetdata;
    console.log(JSON.stringify(data));
    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(res => {
            console.log(res);
            return res.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error('Error:', err);
        });
    location.reload();
}

const deleteValue = (e) => {
    console.log(e);
    console.log(sheet);
    let x = confirm("Delete for sure?")
    if (x) {
        fetch(`${sheetLink}/${sheet}/${e.dataset.id}`, {
                method: 'DELETE'
            })
            .then(res => res.json)
            .then(data => console.log('Success:', data))
            .catch(err => console.error('Error:', err));
        console.log('deleted');
        location.reload();
    }
}

document.getElementById("info").addEventListener('change', (e) => {
    selectChange(document.getElementById("types"));
});

document.getElementById('addValues').addEventListener('click', (e) => {
    setupValues();
})

document.getElementById("postSubmit").addEventListener('click', (e) => {
    postData();
})