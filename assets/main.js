// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9Jp0ubJWKziMYYB8kPaVkCJpHKs-qCrA",
    authDomain: "wlbalancer.firebaseapp.com",
    databaseURL: "https://wlbalancer-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "wlbalancer",
    storageBucket: "wlbalancer.appspot.com",
    messagingSenderId: "408883615303",
    appId: "1:408883615303:web:f9123480ff25d021ba4362"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// writing data
function writeUserData(d_time, userId, type) {
    const reference = ref(db, type + '/' + userId);

    set(reference, {
        datetime: d_time
    });
}

// get current time
function get_current_time() {
    let currentdate = new Date();
    let datetime = (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + "-"
        + currentdate.getFullYear() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    return datetime;
}


// get balance
function find_balance(result) {
    // let i = 0;

    // console.log(earn1['e'+i.toString()+'s']['datetime']);
    let earn1 = result[0];
    let earn_len = (Object.keys(result[0]).length / 2)

    let spend1 = result[1];
    let spend_len = (Object.keys(result[1]).length / 2)

    let net_earn = 0;
    let net_spend = 0;

    let et1 = 0;
    let et2 = 0;
    let st1 = 0;
    let st2 = 0;



    // adding earn
    for (let i = 1; i <= earn_len; i++) {
        et1 = new Date(earn1['e' + i.toString() + 's']['datetime']);
        et2 = new Date(earn1['e' + i.toString() + 'f']['datetime']);
        net_earn = net_earn + (et2 - et1)

    }

    // adding spend
    for (let i = 1; i <= spend_len; i++) {
        st1 = new Date(spend1['s' + i.toString() + 's']['datetime']);
        st2 = new Date(spend1['s' + i.toString() + 'f']['datetime']);
        net_spend = net_spend + (st2 - st1)
    }

    return ((net_earn - net_spend) / 1000);
}


// reading data
async function GetAllDataOnce(type) {
    const dbRef = ref(db);
    var records = [];
    await get(child(dbRef, type)).then((snapshot) => {
        snapshot.forEach(childSnapshot => {
            records.push(childSnapshot.val());
        });
    });
    return records;
}

// Global variables
const time_el = document.querySelector('.watch .time');
const earn_btn = document.getElementById('earn');
const save_btn = document.getElementById("save");
const spend_btn = document.getElementById("spend");
const div_cl = document.getElementById("div_cl");
save_btn.style.display = "none"

function set_time(t_seconds){
    // Format our time
    let hrs = Math.floor(t_seconds / 3600);
    let mins = Math.floor((t_seconds - (hrs * 3600)) / 60);
    let secs = t_seconds % 60;

    if (secs < 10) secs = '0' + secs;
    if (mins < 10) mins = "0" + mins;
    if (hrs < 10) hrs = "0" + hrs;


    time_el.innerText = `${hrs}:${mins}:${secs}`;
}

window.onload = function () {
    GetAllDataOnce('/').then(function (result) {


        let seconds = find_balance(result);
        let earn_index = (Object.keys(result[0]).length)

        let spend_index = (Object.keys(result[1]).length)

        let t_seconds = seconds;
        let interval = null;

        // Event listeners
        earn_btn.addEventListener('click', earn);
        save_btn.addEventListener("click", save);
        spend_btn.addEventListener("click", spend);



        if(spend_index%2 != 0){
        
            console.log("s" + (Math.floor(spend_index / 2) + 1).toString() + 's');
            let tmp1 = new Date(result[1][("s" + (Math.floor(spend_index / 2) + 1).toString() + 's')]['datetime']);
            let tmp2 = new Date();
            seconds = seconds - Math.floor((tmp2 - tmp1)/1000);
            
            earn_btn.style.display = "none"
            spend_btn.style.display = "none"
            save_btn.style.display = "block"

            // setting initial time
            if (seconds >= 0) {
                div_cl.style.backgroundColor = '#005200';
                t_seconds = seconds;
            }
            else {
                div_cl.style.backgroundColor = '#7a0000';
                t_seconds = seconds * -1;
            }
            set_time(t_seconds);

            interval = setInterval(function () { timer(0); }, 1000);
        }
        else if(earn_index%2 != 0){
            
            console.log("e" + (Math.floor(earn_index / 2) + 1).toString() + 's');
            let tmp1 = new Date(result[0][("e" + (Math.floor(earn_index / 2) + 1).toString() + 's')]['datetime']);
            let tmp2 = new Date();
            seconds = seconds + Math.floor((tmp2 - tmp1)/1000);
    
            earn_btn.style.display = "none"
            spend_btn.style.display = "none"
            save_btn.style.display = "block"

            // setting initial time
            if (seconds >= 0) {
                div_cl.style.backgroundColor = '#005200';
                t_seconds = seconds;
            }
            else {
                div_cl.style.backgroundColor = '#7a0000';
                t_seconds = seconds * -1;
            }
            set_time(t_seconds);
    
            interval = setInterval(function () { timer(1); }, 1000);
    }

    else{
        
                // setting initial time
                if (seconds >= 0) {
                    div_cl.style.backgroundColor = '#005200';
                    t_seconds = seconds;
                }
                else {
                    div_cl.style.backgroundColor = '#7a0000';
                    t_seconds = seconds * -1;
                }
                
                set_time(t_seconds);

    }
    
    



        // Update the timer
        function timer(flag) {
            if (flag == 1) {
                seconds = seconds + 1;
            }
            else {
                seconds = seconds - 1;
            }

            if (seconds >= 0) {
                div_cl.style.backgroundColor = '#005200';
                t_seconds = seconds;
            }
            else {
                div_cl.style.backgroundColor = '#7a0000';
                t_seconds = seconds * -1;
            }

            set_time(t_seconds);
        }


        function earn() {
            if (interval) {
                return
            }

            // earn start
            earn_index = earn_index + 1;
            writeUserData(get_current_time(), ("e" + (Math.floor(earn_index / 2) + 1).toString() + 's'), 'earn');

            earn_btn.style.display = "none"
            spend_btn.style.display = "none"
            save_btn.style.display = "block"

            interval = setInterval(function () { timer(1); }, 1000);

        }


        function spend() {

            if (interval) {
                return
            }

            // spend start
            spend_index = spend_index + 1;
            writeUserData(get_current_time(), ("s" + (Math.floor(spend_index / 2) + 1).toString() + 's'), 'spend');

            earn_btn.style.display = "none"
            spend_btn.style.display = "none"
            save_btn.style.display = "block"

            interval = setInterval(function () { timer(0); }, 1000);
        }


        function save() {


            if (spend_index % 2 == 0) {
                // earn finish
                earn_index = earn_index + 1;
                writeUserData(get_current_time(), (("e" + Math.floor(earn_index / 2)).toString() + 'f'), 'earn');
            }
            else {
                // spend finish
                spend_index = spend_index + 1;
                writeUserData(get_current_time(), (("s" + Math.floor(spend_index / 2)).toString() + 'f'), 'spend');
            }

            earn_btn.style.display = "block"
            spend_btn.style.display = "block"
            save_btn.style.display = "none"
            clearInterval(interval);
            interval = null;
        }


    });


};