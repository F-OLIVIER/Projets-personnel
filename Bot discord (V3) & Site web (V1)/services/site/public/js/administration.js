import { adressAPI } from "./config.js";
import { communBlock, createHTMLElement, fetchServer, fetchlogout, removeHTMLTags } from "./useful.js";

export async function administration() {
    containerAppAdmin(await fetchServer('CheckAppAdmin'));
}

let checkedRadioValue_Unit_maitrise = '';
function containerAppAdmin(data) {
    if (data.Gestion.Logged && data.Gestion.Officier) {
        communBlock(data)

        const subContainer = createHTMLElement('div', 'subContainerbotEtat');

        // Etat du bot
        let divBotEtat = createHTMLElement('div', 'divBotEtat');
        let botEtat = createHTMLElement('div', 'botEtat');
        let buttonBotEtat = createHTMLElement('button', 'buttonBotEtat');
        buttonBotEtat.type = 'button';
        buttonBotEtat.className = 'buttonBotEtat';
        if (data.Gestion.BotActivate) {
            botEtat.textContent = "Fonction automatique du bot discord actif";
            buttonBotEtat.value = "false";
            buttonBotEtat.textContent = 'Désactiver les fonctions automatique';
        } else {
            botEtat.textContent = "Fonction automatique (reset en fin de GvG) du bot discord inactif";
            buttonBotEtat.value = "true";
            buttonBotEtat.textContent = 'Activer les fonctions automatique';
        }
        divBotEtat.appendChild(botEtat);
        let explicationactivation = createHTMLElement('div', 'explicationbotetat');
        explicationactivation.innerHTML = "<u>Lors de l'activation des fonctions automatique :</u></br>- Effectue un reset avec calcul statistique de la précédente GvG</br>- Affiche un message comme quoi les gvg sont en drill et ne necessite pas d'inscription</br>- Désactive les resets automatique des mardi et des samedi";
        divBotEtat.appendChild(explicationactivation);
        let explicationdesactivation = createHTMLElement('div', 'explicationbotetat');
        explicationdesactivation.innerHTML = "<u>Lors de la désactivation des fonctions automatique :</u></br>Change le message d'inscription pour ré-activé les inscriptions</br>Ré-active les resets automatique des mardi et des samedi";
        divBotEtat.appendChild(explicationdesactivation);

        divBotEtat.appendChild(buttonBotEtat);
        subContainer.appendChild(divBotEtat);

        // Ajouter une unité
        let divErrorAddUnit = document.createElement('div');
        divErrorAddUnit.id = 'divErrorAddUnit';
        divErrorAddUnit.className = 'divError';
        divErrorAddUnit.style.display = 'none';
        subContainer.appendChild(divErrorAddUnit);

        let divNewUnit = createHTMLElement('div', 'divNewUnit');
        let titleNewUnit = createHTMLElement('div', 'titleNewUnit');
        titleNewUnit.textContent = 'Ajouter une nouvelle unité';
        divNewUnit.appendChild(titleNewUnit);

        let formNewUnit = document.createElement('form');
        formNewUnit.id = 'formNewUnit';
        formNewUnit.className = 'newUnit';
        formNewUnit.method = 'POST';
        formNewUnit.enctype = 'multipart/form-data';
        // Unit_name
        let input_Unit_name = createHTMLElement('input', 'nameNewUnit');
        input_Unit_name.placeholder = "Nom de l'unité";
        input_Unit_name.required;
        formNewUnit.appendChild(input_Unit_name);
        // Unit_influence
        let input_Unit_influence = createHTMLElement('input', 'influNewUnit');
        input_Unit_influence.type = 'number';
        input_Unit_influence.required;
        input_Unit_influence.placeholder = "Influence de l'unité";
        formNewUnit.appendChild(input_Unit_influence);
        // Unit_lvlMax
        let input_Unit_lvlMax = createHTMLElement('input', 'lvlMaxNewUnit');
        input_Unit_lvlMax.type = 'number';
        input_Unit_lvlMax.required;
        input_Unit_lvlMax.placeholder = "Level max de l'unité";
        formNewUnit.appendChild(input_Unit_lvlMax);
        // Unit_tier
        let input_Unit_tier = createHTMLElement('select', 'tierNewUnit');
        input_Unit_tier.required;
        let title_option_Unit_tier = ["Tier de l'unité", "T3", "T4", "T5"];
        let option_Unit_tier = ["", "T3", "T4", "T5"];
        for (let i = 0; i < option_Unit_tier.length; i++) {
            let option = document.createElement('option');
            option.value = option_Unit_tier[i];
            option.text = title_option_Unit_tier[i];
            input_Unit_tier.appendChild(option);
        }
        formNewUnit.appendChild(input_Unit_tier);
        // Unit_type
        let input_Unit_type = createHTMLElement('select', 'typeNewUnit');
        input_Unit_type.required;
        let titleOption_Unit_type = ["Type d'unité", "Infanterie", "Distant", "Cavalerie"];
        let option_Unit_type = ["", "Infanterie", "Distant", "Cavalerie"];
        for (let i = 0; i < option_Unit_type.length; i++) {
            let option = document.createElement('option');
            option.value = option_Unit_type[i];
            option.text = titleOption_Unit_type[i];
            input_Unit_type.appendChild(option);
        }
        formNewUnit.appendChild(input_Unit_type);

        // Maitrise d'unité
        let input_Unit_maitrise = createHTMLElement('fieldset', 'maitriseUnit');
        let legend = document.createElement('legend');
        legend.textContent = " Maîtrise d'unité ";
        input_Unit_maitrise.appendChild(legend);

        const containFieldset = [['Présente', '1'], ['Absente', '0']];
        containFieldset.forEach(name => {
            const divfieldset = document.createElement('div');

            const radio = document.createElement('input');
            radio.setAttribute('type', 'radio');
            radio.setAttribute('id', name[0]);
            radio.setAttribute('name', 'drone');
            radio.setAttribute('value', name[1]);
            if (name[1] === '0') {
                radio.setAttribute('checked', 'checked');
            }
            divfieldset.appendChild(radio);

            const label = document.createElement('label');
            label.setAttribute('for', name[0]);
            label.textContent = name[0];
            divfieldset.appendChild(label);

            radio.addEventListener('change', function () {
                checkedRadioValue_Unit_maitrise = radio.value;
            });

            input_Unit_maitrise.appendChild(divfieldset);
        });
        formNewUnit.appendChild(input_Unit_maitrise);

        // Unit_img
        let input_Unit_img = createHTMLElement('input', 'imgNewUnit');
        input_Unit_img.required;
        input_Unit_img.type = 'file';
        input_Unit_img.lang = 'fr';
        input_Unit_img.accept = '.jpg, .jpeg, .png,';
        formNewUnit.appendChild(input_Unit_img);

        // button
        let buttonNewUnit = createHTMLElement('button', 'buttonNewUnit');
        buttonNewUnit.textContent = "Ajouter l'unité";
        buttonNewUnit.type = 'submit';
        formNewUnit.appendChild(buttonNewUnit);

        divNewUnit.appendChild(formNewUnit);
        subContainer.appendChild(divNewUnit);

        // Modifier une unité
        let divErrorChangeUnit = document.createElement('div');
        divErrorChangeUnit.id = 'divErrorChangeUnit';
        divErrorChangeUnit.className = 'divError';
        divErrorChangeUnit.style.display = 'none';
        subContainer.appendChild(divErrorChangeUnit);

        let divChangeUnit = createHTMLElement('div', 'divChangeUnit');
        let titleChangeUnit = document.createElement('div');
        titleChangeUnit.className = 'titleChangeUnit'
        titleChangeUnit.textContent = 'Modifier une unité';
        divChangeUnit.appendChild(titleChangeUnit);

        let formChangeUnit = createHTMLElement('form', 'formchangeUnit');
        formChangeUnit.enctype = 'multipart/form-data';
        formChangeUnit.method = 'POST';
        let selectChangeUnit = createHTMLElement('select', 'selectChangeUnit');
        let defaultChangeUnit = document.createElement('option');
        defaultChangeUnit.value = "";
        defaultChangeUnit.text = "Choisissez";
        selectChangeUnit.appendChild(defaultChangeUnit);
        for (let i = 0; i < data.ListUnit.length; i++) {
            const currentUnit = data.ListUnit[i];
            let option = document.createElement('option');
            option.value = currentUnit.Unit_name;
            option.text = currentUnit.Unit_name;
            selectChangeUnit.appendChild(option);
        }
        formChangeUnit.appendChild(selectChangeUnit);
        divChangeUnit.appendChild(formChangeUnit);
        subContainer.appendChild(divChangeUnit);

        // Ajouter une nouvelle classe
        let divNewclass = createHTMLElement('div', 'divNewclass');
        let titleNewclass = createHTMLElement('div', 'titleNewclass');
        titleNewclass.textContent = "Ajouter une nouvelle classe d'arme";
        divNewclass.appendChild(titleNewclass);

        let formNewclass = document.createElement('form');
        formNewclass.id = 'formNewclass';
        formNewclass.className = 'formNewclass';
        formNewclass.method = 'POST';
        // class_name
        let input_class_name = createHTMLElement('input', 'nameNewclass');
        input_class_name.placeholder = "Nom de la nouvelle arme";
        input_class_name.required;
        formNewclass.appendChild(input_class_name);

        let buttonNewclass = createHTMLElement('button', 'buttonNewclass');
        buttonNewclass.textContent = "Ajouter la classe d'arme";
        buttonNewclass.type = 'submit';
        formNewclass.appendChild(buttonNewclass);

        divNewclass.appendChild(formNewclass);
        subContainer.appendChild(divNewclass);

        // Reset des stat GvG (participé et total)
        let divresetnbgvg = createHTMLElement('div', 'divresetnbgvg');
        let titleresetnbgvg = createHTMLElement('div', 'titleresetnbgvg');
        titleresetnbgvg.textContent = "Ré-initialisation stat GvG";
        divresetnbgvg.appendChild(titleresetnbgvg);

        let explicationresetnbgvg = createHTMLElement('div', 'explicationbotetat');
        explicationresetnbgvg.textContent = '(Mettre à 0 le nombre de GvG participé et le nombre total de GvG pour tous les joueurs)';
        divresetnbgvg.appendChild(explicationresetnbgvg);

        let formresetnbgvg = document.createElement('form');
        formresetnbgvg.id = 'formresetnbgvg';
        formresetnbgvg.className = 'formresetnbgvg';
        formresetnbgvg.method = 'POST';

        let buttonresetnbgvg = createHTMLElement('button', 'buttonresetnbgvg');
        buttonresetnbgvg.textContent = "Re-initialiser les stat GvG";
        buttonresetnbgvg.type = 'submit';
        formresetnbgvg.appendChild(buttonresetnbgvg);

        divresetnbgvg.appendChild(formresetnbgvg);
        subContainer.appendChild(divresetnbgvg);

        let Container = document.getElementById('Container');
        Container.innerHTML = '';
        Container.appendChild(subContainer);

        addEventOnAllButton(data.ListUnit);

    } else {
        fetchlogout();
    }
}

let timerThrottlebutton = 0;
function addEventOnAllButton(listUnit) {
    // Activation/Désactivation du bot
    document.getElementById('buttonBotEtat').addEventListener('click', (event) => {
        event.preventDefault();
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            adminitrateBot('buttonBotEtat');
        }
    });

    // Ajout d'une nouvelle unité
    document.getElementById('formNewUnit').addEventListener('submit', (event) => {
        event.preventDefault();
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            adminitrateBot('buttonNewUnit');
        }
    });

    // Modification d'une unité existante
    let selectChangeUnit = document.getElementById('selectChangeUnit');
    selectChangeUnit.addEventListener('change', () => {
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            let unitSelected;
            for (let i = 0; i < listUnit.length; i++) {
                if (selectChangeUnit.value === listUnit[i].Unit_name) {
                    unitSelected = listUnit[i];
                    break;
                }
            }

            // suppression des anciens éléments si existant
            if (document.getElementById('changeUnitInfluence')) {
                document.getElementById('changeUnitInfluence').remove();
                document.getElementById('changeUnitLvlMax').remove();
                // document.getElementById('changeUnitTier').remove();
                document.getElementById('changeUnitimg').remove();
                document.getElementById('buttonChangeUnit').remove();
            }

            if (selectChangeUnit.value != "") {
                // Ajout des nouveaux éléments
                let formChangeUnit = document.getElementById('formchangeUnit');
                // Unit_influence
                let input_Unit_influence = createHTMLElement('input', 'changeUnitInfluence');
                input_Unit_influence.type = 'number';
                input_Unit_influence.placeholder = 'Influence actuel : ' + unitSelected.Unit_influence;
                formChangeUnit.appendChild(input_Unit_influence);
                // Unit_lvlMax
                let input_Unit_lvlMax = createHTMLElement('input', 'changeUnitLvlMax');
                input_Unit_lvlMax.type = 'number';
                input_Unit_lvlMax.placeholder = 'Level max actuel : ' + unitSelected.Unit_lvlMax;
                formChangeUnit.appendChild(input_Unit_lvlMax);

                // Maitrise d'unité
                if (unitSelected.Unit_maitrise === '0') {
                    let input_Unit_maitrise = createHTMLElement('fieldset', 'changemaitriseUnit');
                    let legend = document.createElement('legend');
                    legend.textContent = " Maîtrise d'unité ";
                    input_Unit_maitrise.appendChild(legend);

                    const divfieldset = document.createElement('div');
                    const checkbox = document.createElement('input');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.setAttribute('name', 'changeUnitMaitrise');
                    checkbox.setAttribute('id', 'changeUnitMaitrise');
                    checkbox.setAttribute('value', '1');
                    divfieldset.appendChild(checkbox);

                    const label = document.createElement('label');
                    label.setAttribute('for', "Ajouter à l'unité une maîtrise");
                    label.textContent = "Ajouter à l'unité une maîtrise";
                    divfieldset.appendChild(label);
                    label.addEventListener('click', function () {
                        const now = new Date();
                        if (now - timerThrottlebutton > 500) {
                            timerThrottlebutton = now;
                            checkbox.checked = !checkbox.checked;
                        }
                    });

                    input_Unit_maitrise.appendChild(divfieldset);
                    formChangeUnit.appendChild(input_Unit_maitrise);
                }

                // Unit_img
                let input_Unit_img = createHTMLElement('input', 'changeUnitimg');
                input_Unit_img.type = 'file';
                input_Unit_img.lang = 'fr';
                input_Unit_img.accept = '.jpg, .jpeg, .png';
                formChangeUnit.appendChild(input_Unit_img);

                // button
                let buttonChangeUnit = createHTMLElement('button', 'buttonChangeUnit');
                buttonChangeUnit.type = 'submit';
                buttonChangeUnit.textContent = "Modifier l'unité";
                formChangeUnit.appendChild(buttonChangeUnit);

                let divChangeUnit = document.getElementById('divChangeUnit');
                divChangeUnit.appendChild(formChangeUnit);
            }

            document.getElementById('formchangeUnit').addEventListener('submit', (event) => {
                event.preventDefault();
                const now = new Date();
                if (now - timerThrottlebutton > 500) {
                    timerThrottlebutton = now;
                    adminitrateBot('buttonChangeUnit');
                }
            });
        }
    });

    // Ajouter une nouvelle arme (new class)
    document.getElementById('buttonNewclass').addEventListener('click', (event) => {
        event.preventDefault();
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            adminitrateBot('buttonNewclass');
        }
    });

    // Reset des stat GvG (participé et total)
    document.getElementById('buttonresetnbgvg').addEventListener('click', (event) => {
        event.preventDefault();
        const now = new Date();
        if (now - timerThrottlebutton > 500) {
            timerThrottlebutton = now;
            adminitrateBot('buttonresetnbgvg');
        }
    });
}

// option et le name du button cliquer
async function adminitrateBot(option) {
    let dataToSend = {};

    // activate or desactivate bot
    if (option === 'buttonBotEtat') {
        dataToSend.Allumage = document.getElementById('buttonBotEtat').value; // false = desactivation, true = activation
        sendData(dataToSend);
    } else if (option === 'buttonNewclass') {
        dataToSend.newWeapon = document.getElementById('nameNewclass').value;
        sendData(dataToSend);
    } else if (option === 'buttonresetnbgvg') {
        dataToSend.resetnbgvg = true;
        sendData(dataToSend);
    } else {
        let formData = new FormData();

        // create Unit
        if (option === 'buttonNewUnit') {
            let createUnit = {};
            const inputvalue_name = document.getElementById('nameNewUnit').value
            createUnit.Unit_name = removeHTMLTags(inputvalue_name);
            if (dataToSend.Unit_name !== inputvalue_name) {
                alert("Les balises HTML ne sont pas autorisées.");
                return
            }
            createUnit.Unit_influence = document.getElementById('influNewUnit').value;
            if (dataToSend.Unit_influence > 500) {
                alert("Influence impossible.");
                return
            }
            createUnit.Unit_lvlMax = document.getElementById('lvlMaxNewUnit').value;
            if (dataToSend.Unit_lvlMax > 50) {
                alert("Level max d'unité impossible.");
                return
            }
            createUnit.Unit_tier = document.getElementById('tierNewUnit').value;
            createUnit.Unit_type = document.getElementById('typeNewUnit').value;
            createUnit.Unit_maitrise = checkedRadioValue_Unit_maitrise;

            dataToSend.createUnit = createUnit;
            formData.append('data', JSON.stringify(dataToSend));

            let input_new_img = document.getElementById('imgNewUnit');
            if (input_new_img.files && input_new_img.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var image = new Image();
                    image.src = e.target.result;
                    formData.append('image', input_new_img.files[0]);

                    if (createUnit.Unit_name === "" ||
                        createUnit.Unit_influence === "" ||
                        createUnit.Unit_lvlMax === "" ||
                        createUnit.Unit_tier === "" ||
                        createUnit.Unit_type === "") {
                        let divError = document.getElementById('divErrorAddUnit');
                        divError.textContent = "Merci de compléter tout les champs pour la création de la nouvelle unité";
                        divError.style.display = 'block';

                    } else if (createUnit.Unit_influence < 0 || createUnit.Unit_influence > 500 ||
                        createUnit.Unit_lvlMax < 0 || createUnit.Unit_lvlMax > 50
                    ) {
                        let divError = document.getElementById('divErrorAddUnit');
                        divError.textContent = "Probléme de saisie dans un champs pour la création de la nouvelle unité";
                        divError.style.display = 'block';
                    } else {
                        sendFormData(formData);
                        window.location.href = '/AppAdmin';
                    }
                };
                // Démarrer la lecture du fichier
                reader.readAsDataURL(input_new_img.files[0]);
            } else {
                let divError = document.getElementById('divErrorAddUnit');
                divError.textContent = "Merci de compléter tout les champs et mettre l'image pour la création de la nouvelle unité";
                divError.style.display = 'block';
            }
        }

        // change Unit
        if (option === 'buttonChangeUnit') {
            let changeUnit = {};
            // changeUnit.Unit_name = removeHTMLTags(document.getElementById('selectChangeUnit').value);
            const inputvalue_name = document.getElementById('selectChangeUnit').value
            changeUnit.Unit_name = removeHTMLTags(inputvalue_name);
            if (changeUnit.Unit_name !== inputvalue_name) {
                alert("Les balises HTML ne sont pas autorisées.");
                return
            }
            changeUnit.Unit_influence = document.getElementById('changeUnitInfluence').value;
            if (changeUnit.Unit_influence > 500 || changeUnit.Unit_influence < 0) {
                alert("Influence impossible.");
                return
            }
            changeUnit.Unit_lvlMax = document.getElementById('changeUnitLvlMax').value;
            if (changeUnit.Unit_influence > 50 || changeUnit.Unit_influence < 0) {
                alert("Level max d'unité impossible.");
                return
            }
            // changeUnit.Unit_tier = document.getElementById('changeUnitTier').value;
            const checkboxChangeUnitMaitrise = document.getElementById('changeUnitMaitrise');
            if (checkboxChangeUnitMaitrise.checked) {
                changeUnit.Unit_maitrise = checkboxChangeUnitMaitrise.value;
            } else {
                changeUnit.Unit_maitrise = '';
            }
            dataToSend.changeUnit = changeUnit;
            formData.append('data', JSON.stringify(dataToSend));

            let input_change_img = document.getElementById('changeUnitimg');
            if (input_change_img.files && input_change_img.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    let image = new Image();
                    image.src = e.target.result;
                    formData.append('image', input_change_img.files[0]);
                    sendFormData(formData);
                    window.location.href = '/AppAdmin';
                };
                reader.readAsDataURL(input_change_img.files[0]);
            } else if (changeUnit.Unit_influence == "" && changeUnit.Unit_lvlMax == "" && !checkboxChangeUnitMaitrise.checked) {
                let divErrorChangeUnit = document.getElementById('divErrorChangeUnit');
                divErrorChangeUnit.textContent = "Merci de compléter au moins un champs ou mettre une image pour mettre à jour l'unité " + changeUnit.Unit_name;
                divErrorChangeUnit.style.display = 'block';
            } else { // si send des data uniquement
                sendFormData(formData);
                window.location.href = '/AppAdmin';
            }
        }
    }
}

function sendData(dataToSend) {
    // console.log('dataToSend : ', dataToSend);
    fetch(adressAPI + 'UpdateAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
    })
        .catch(error => {
            console.error('Erreur avec les données:', error);
        });

    // rechargement de page aprés modification
    window.location.href = '/AppAdmin';
}
function sendFormData(formData) {
    // console.log('formData : ', formData);
    fetch(adressAPI + 'adminitrateBot', {
        method: 'POST',
        body: formData
    })
        .catch(error => {
            console.error('Erreur lors de l\'envoi de l\'image et des données:', error);
        });
}

