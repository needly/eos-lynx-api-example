/* jslint esversion: 6 */

// Lynx Mobile Integrated Browser 
// will inject the lynxMobile SDK object 
// into the page.
// Your app will have access to the global lynxMobile 
// Add an event listner on window like below to be notified
// once the lynxMobile object has been added to window.

window.addEventListener("lynxMobileLoaded", function() {

  // lynx is on the window and ready!
  alert('eos-lynx api is ready');

  // set html class signaling your html the api readiness
  document.getElementById('hw-cont').classList.add('is-ready');

  // build currency selector content based or your account
  window.currency = {};

  document.getElementById("send-transfer").addEventListener("click", pushTransfer);

  prepareCurencySelector();
});


function getAccountName() {
  (async() => {

    //accquire current users eos account from the mobile wallet
    let accountName = await getAccountNameFunc();

    // "foofoobarbar" 12 character account name returned here
    alert("your current eos account: \n" + accountName);

  })();
}


function getAccountNameFunc() {

  let result;

  try {
    result = window.lynxMobile.requestSetAccountName();
  } catch (err) {
    console.log(err);
  }

  return result;
}



function getAccountState() {
  (async() => {

    // get account current account name
    let accountName = await getAccountNameFunc();

    // get account state based on the account name
    let accountState = await getAccountStateFunc(accountName);

    // account state json object returned here
    alert("your current eos account state: \n" + JSON.stringify(accountState, 2, false));

  })();
}

function getAccountStateFunc(accountName) {

  let result;

  try {
    result = window.lynxMobile.requestSetAccount(accountName);
  } catch (err) {
    console.log(err);
  }

  return result;
}

function prepareCurencySelector() {
  (async() => {

    let accountName = await getAccountNameFunc();
    let accountState = await getAccountStateFunc(accountName);

    console.log(accountState);

    let currencyCodes = getCurrencyCodesArray(accountState);
    let currencyContracts = getCurrencyContractsArray(accountState);

    buildSelectort(currencyCodes, currencyContracts);

  })();
}


function getCurrencyCodesArray(accountState) {
  return _.pluck(accountState.tokens, 'symbol');
}

function getCurrencyContractsArray(accountState) {
  return _.pluck(accountState.tokens, 'contract');
}

function buildSelectort(currencyCodes, currencyContracts) {
  let selector = document.getElementById('currency-selector');
  _.each(currencyCodes, function(element, index) {

    window.currency[element] = currencyContracts[index];
    let optionElement = '<option value="' + element + '">' + element + '</option>';
    selector.insertAdjacentHTML('beforeend', optionElement);

  });
}

function pushTransfer($event) {
  // console.log($event);

  console.log($event.target.parentNode[0].value);
  console.log($event.target.parentNode[1].value);
  console.log($event.target.parentNode[2].value);
  console.log($event.target.parentNode[3].value);

  let formData = {
    symbol: $event.target.parentNode[0].value,
    contract: window.currency[$event.target.parentNode[0].value],
    toAccount: $event.target.parentNode[1].value,
    amount: $event.target.parentNode[2].value,
    memo: $event.target.parentNode[3].value
  }

  console.log('formData', formData);

  // Use await to return a promise
  (async() => {

    let result;

    try {
      result = await window.lynxMobile.transfer(formData);
    } catch (err) {
      console.log(err);
    }

    console.log(result); // {transaction_id: "3a50d9a4bda0a8e2a4c23526da15369345bd61c72d37d844365f4bfee5c18fcb", processed: Object}

  })();
}