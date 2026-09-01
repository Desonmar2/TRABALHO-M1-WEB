import * as donationsService from'./donationService.js'
import * as donationsUI from'./donationUI.js'

const render = (term = "", priority = "todas") => {

  const data = donationsService.get(term, priority);
  donationsUI.appendItems(data);}



  export {render}




