const hubspot = require('@hubspot/api-client');

exports.main = async (event, callback) => {
  
  // hubspot api client
  
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.YOUR_SECRET_KEY_HERE
  });
  
  let deletedCompanyAssociations = [];
  
  
  // api call to get company associations
  var associationAPIpath = '/crm/v4/objects/deal/' + event.object.objectId + '/associations/company?limit=500';
  
  const associationAPIresponse = await hubspotClient.apiRequest({
    method: 'GET',
    path: associationAPIpath
   });
  
  const associationJSON = await associationAPIresponse.json();
  
  // loop through responses to delete associations
  if  (associationJSON.results.length > 0) {
	for (var i = 0; i < associationJSON.results.length; i++) {
      console.log(i);
      let companyId = associationJSON.results[i].toObjectId;
    
      // API call to remove association
      var deleteCompanyAssocPath = '/crm/v4/objects/deal/' + event.object.objectId + '/associations/company/' + companyId;
      await hubspotClient.apiRequest({
        method: 'DELETE',
        path: deleteCompanyAssocPath
      });
      
      deletedCompanyAssociations.push(companyId);
      console.log("Deleted deal's association to company: " + companyId);
		}
	}


  callback({
    outputFields: {
      deleted_associations: deletedCompanyAssociations
    }
  });
}
