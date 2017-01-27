// ==UserScript==
// @name         DisableCompaniesJobs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  script to remove companies from jobs ads
// @author       Guterres
// @match        https://www.itjobs.pt/emprego*
// @match        http://www.itjobs.pt/emprego*
// @match        http://www.net-empregos.com/listagem_livre2_2.asp*
// @match        http://www.net-empregos.com/ofertas*
// @match        http://www.net-empregos.com/listagem_livre2.asp*
// @match        https://www.net-empregos.com/listagem_livre2_2.asp*
// @match        https://www.net-empregos.com/ofertas*
// @match        https://www.net-empregos.com/listagem_livre2.asp*
// @match        http://emprego.sapo.pt/emprego/ofertas.htm*
// @match        https://emprego.sapo.pt/emprego/ofertas.htm*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var companies = [ "accenture", "randstad", "hays", "kcs" ];
    var ads = [ "itjobs", "net-empregos", "sapo" ];

    for(var i = 0; i < ads.length; i++){
        if(location.href.indexOf(ads[i]) >= 0){
            locationAd(ads[i]);
            break;
        }
    }

    function locationAd(href){
        switch(href){
            case 'itjobs':
                adItjobs();
                break;
            case 'net-empregos':
                adNetempregos();
                break;
            case 'sapo':
                adSapo();
                break;
            default:
                break;
        }
    }

    function disableCompanies(element, parent){
        for(var i = 0; i < companies.length; i++){
            if(element.toUpperCase().includes(companies[i].toUpperCase())){
                parent.remove();
                return true;
            }
        }
        return false;
    }

    function adItjobs(){
        var count = 0;
        var blocks = document.getElementsByClassName("block borderless");
        for(var x=0; x < blocks.length; x++){
            var list = blocks[x].getElementsByClassName("list-unstyled listing")[0];
            if(!list){  continue;  }
            var companiesItjobs = list.getElementsByTagName("li");
            for(var z=0; z < companiesItjobs.length; z++){
                var name = companiesItjobs[z].getElementsByClassName("list-name")[0].getElementsByTagName("a")[0];
                if(!name){ continue; }
                if(disableCompanies(name.innerHTML, companiesItjobs[z])){ count++; z--; }
            }
            if(companiesItjobs.length === 0){ blocks[x].remove(); x--; }
        }
        printRemove(count);
    }

    function adNetempregos(){
        var count = 0;
        var tables = document.querySelectorAll('table[style]');
        for(var i = 0; i < tables.length; i++){
            var name = tables[i].querySelectorAll('td > b > font')[1];
            if(!name){ continue; }
            if(disableCompanies(name.innerHTML, tables[i])){ count++; }
        }
        printRemove(count);
    }

    function adSapo(){
        var count = 0;
        var trs = document.getElementsByTagName('tr');
        for(var i = 0; i < trs.length; i++){
            var name = trs[i].querySelector('td.col2 > strong > span');
            if(!name){ continue; }
            if(disableCompanies(name.innerHTML, trs[i])){ count++; i--; }
        }
        printRemove(count);
    }

    function printRemove(count){
        if(count > 0){
            console.log("removed "+count+ " ads");
        }
    }

})();
