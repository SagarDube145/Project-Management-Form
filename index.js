var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var projectDB = "COLLEGE-DB";
var projectRelationName = "PROJECT-TABLE";
var connToken = "90932713|-31949276665601317|90954730";

$("#projectid").focus();

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getProjectIdAsJsonObj() {
  var projectid = $("#projectid").val();
  var jsonStr = {
    id: projectid,
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#projectname").val(record.name);
  $("#assname").val(record.assname);
  $("#assdate").val(record.assdate);
  $("#deadline").val(record.deadline);
}

function resetForm() {
  $("#projectid").val("");
  $("#projectname").val("");
  $("#assname").val("");
  $("#assdate").val("");
  $("#deadline").val("");
  $("#projectid").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#update").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#projectid").focus();
}
function validateData() {
  var projectid, projectname, assname, assdate, deadline;
  projectid = $("#projectid").val();
  projectname = $("#projectname").val();
  assname = $("#assname").val();
  assdate = $("#assdate").val();
  deadline = $("#deadline").val();
  if (projectid === "") {
    alert("Project ID Missing");
    $("#projectid").focus();
    return "";
  }

  if (projectname === "") {
    alert("Project Name Missing");
    $("#projectname").focus();
    return "";
  }

  if (assname === "") {
    alert("Assigned Name Missing");
    $("#assname").focus();
    return "";
  }

  if (assdate === "") {
    alert("Assigned Date Missing");
    $("#assdate").focus();
    return "";
  }

  if (deadline === "") {
    alert("Deadline Missing");
    $("#deadline").focus();
    return "";
  }

  var jsonStrObj = {
    id: projectid,
    name: projectname,
    assname: assname,
    assdate: assdate,
    deadline: deadline,
  };
  return JSON.stringify(jsonStrObj);
}

function getProject() {
  var projectidJsonObj = getProjectIdAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    projectDB,
    projectRelationName,
    projectidJsonObj
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseUrl,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });
  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#projectname").focus();
  } else if (resJsonObj.status === 200) {
    $("#projectid").prop("disabled", true);
    fillData(resJsonObj);

    $("#update").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#projectname").focus();
  }
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === "") {
    return "";
  }
  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    projectDB,
    projectRelationName
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseUrl,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("#projectid").focus();
}
function updateData() {
  $("#update").prop("disabled", true);
  jsonupd = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonupd,
    projectDB,
    projectRelationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseUrl,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#projectid").focus();
}
