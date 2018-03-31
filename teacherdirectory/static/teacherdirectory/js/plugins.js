// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

$(function(){
    //setup django csrftoken cookie for ajax
    //get crsf token cookie
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    //setup ajax crsf header
    function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    function downloadDoc(e){
        e.preventDefault();
        //get curr
        var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
        window.open(dataItem.url);
    }
    //datasource for grid
    var gridDataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: '/teachers/records/',
                dataType: "json"
            },
            update: {
                url: '/teachers/update/',
                type: 'post',
                dataType: "json", 
            },
            destroy: {
                url: '/teachers/destroy/',
                type: 'post',
                dataType: "json"
            },
            create: {
                url: '/teachers/create/',
                type: 'post',
                dataType: "json"
            },
            parameterMap: function(data, operation) {
                //for update operation
                if (operation == "update") {
                    //remove non-model fields
                    var id = data.id;
                    delete data['id'];
                    var model = data.model;
                    delete data['model'];
                    //maintain natural key format
                    var image = [];
                    image.push(data.image[0]);
                    image.push(data.imageUrl);
                    //remove non-model fields
                    delete data.imageUrl;
                    delete data.image;
                    data.image = image;
                    //convert date objects to string
                    data.dob = kendo.toString(data.dob, "yyyy-MM-dd");
                    data.doh = kendo.toString(data.doh, "yyyy-MM-dd");
                    if (data.resign_date =="") {
                        data.resign_date = data.resign_date ;
                    }
                    else {data.resign_date = kendo.toString(data.resign_date, "yyyy-MM-dd");}
                    
                    var result = {
                        pk: id,
                        model: model, 
                        fields: data
                    };
                    console.log(result);
                    return {models: kendo.stringify([result]/*server expects an array/list */)};
                //for creating new record
                }else if(operation == 'create'){
                    //remove non-model fields
                    delete data['id'];
                    //convert date objects to string
                    data.dob = kendo.toString(data.dob, "yyyy-MM-dd");
                    data.doh = kendo.toString(data.doh, "yyyy-MM-dd");

                    if (data.resign_date =="") {
                        data.resign_date = data.resign_date ;
                    }
                    else {data.resign_date = kendo.toString(data.resign_date, "yyyy-MM-dd");}
                    //maintain natural key format
                    var image = [];
                    image.push(data.image[0]);
                    image.push(data.imageUrl);
                    //remove non-model fields
                    delete data.imageUrl;
                    delete data.image;
                    //add image reference in natural key format
                    data.image = image;

                    var result = {
                        pk: null, //no primary-key indicates new record
                        model: 'teacherdirectory.teacher', 
                        fields: data
                    }
                    return {models: kendo.stringify([result]/*server expects array*/)}
                }else if(operation == 'destroy'){
                    return {id:data.id}

                }
            }
        },
        // batch: true,
        // pageSize: 20,
        schema: {
            //parse server response to make it simple
            parse: function(response){
                var records = [];
                for (var i = 0; i < response.length; i++){
                    //simplify server data
                    //if record has no image
                    var imageUrl, image = [];
                    if (response[i].fields.image == null){
                        imageUrl, image = "";
                    }else{
                        image.push(response[i].fields.image[0]);
                        imageUrl = response[i].fields.image[1]
                    }
                    console.log(image);
                    console.log(imageUrl);
                    var record = {
                        id: response[i].pk,
                        model:response[i].model,
                        image: image,
                        imageUrl: imageUrl,
                        faculty_id: response[i].fields.faculty_id,
                        firstname: response[i].fields.firstname,
                        lastname: response[i].fields.lastname,
                        fname: response[i].fields.fname,
                        gender: response[i].fields.gender,
                        nationality: response[i].fields.nationality,
                        nid_pass: response[i].fields.nid_pass,
                        religion: response[i].fields.religion,
                        business_ph: response[i].fields.business_ph,
                        home_ph: response[i].fields.home_ph,
                        mobile_no: response[i].fields.mobile_no,
                        email: response[i].fields.email,
                        cur_add_villordist: response[i].fields.cur_add_villordist,
                        cur_add_province: response[i].fields.cur_add_province,
                        cur_add_country: response[i].fields.cur_add_country,
                        prmnt_add_villordist: response[i].fields.prmnt_add_villordist,
                        prmnt_add_province: response[i].fields.prmnt_add_province,
                        prmnt_add_country: response[i].fields.prmnt_add_country,
                        faculty_type: response[i].fields.faculty_type,
                        department: response[i].fields.department, 
                        office_branch: response[i].fields.office_branch, 
                        dob: response[i].fields.dob, 
                        doh: response[i].fields.doh,
                        salary: response[i].fields.salary,
                        level_degree: response[i].fields.level_degree,
                        focus_area: response[i].fields.focus_area,
                        school_progname: response[i].fields.school_progname,
                        emg_c_name: response[i].fields.emg_c_name,
                        emg_c_phno1: response[i].fields.emg_c_phno1,
                        emg_c_phno2: response[i].fields.emg_c_phno2,
                        emg_contact2_name: response[i].fields.emg_contact2_name,
                        emg_c_relationship: response[i].fields.emg_c_relationship,
                        blood_group: response[i].fields.blood_group,
                        allergies: response[i].fields.allergies,
                        resign_date: response[i].fields.resign_date,
                        resign_reason: response[i].fields.resign_reason,
                        resign_chkliabilites: response[i].fields.resign_chkliabilites,
                        
                    }
                    records.push(record);
                }
                return records;
            },
            model: {
                id: "id",
                fields: {
                    faculty_id: { editable: true, nullable: true },
                    firstname: { validation: { required: true } },
                }
            }
        }
        
    });
    //create kendo grid
    $("#main-grid").kendoGrid({
        dataSource: gridDataSource,
        pageable: true,
        sortable: true,
        height: 550,
        toolbar: ["create"],
        columns: [
            { field:"faculty_id", title: "Faculty ID" },
            { field: "firstname", title:"First Name" },
            { field: "lastname", title:"Last Name" },
            { field: "department", title: "Department"},
            { command: ["edit"], title: ""},
            { command: ["destroy"], title: ""}],
        messages: {
          commands:{
            edit: "View" ,
            destroy: "Delete"
          }

        },
        editable: {
            mode:"popup",
            template: kendo.template($('#popup-editor').html()),
            window: {
                title: 'Teacher details',
                actions: ['Maximize', 'Close'], 
                width: '70%'
            }
        },
        destroy: function (e){
            
        },
        edit: function (e){
            //kendo tabstrip initialization
            e.container.find("#tabstrip")
            .kendoTabStrip()
            .data('kendoTabStrip')
            .activateTab('#tab1');

            //get item id if it's not new
            var itemID, docUploadEnabled = false;
            if(!e.model.isNew()){
                itemID = e.model.id;
                //disable document upload for new record
                docUploadEnabled = true;
            }
            //kendo async file upload
            e.container.find("#files").kendoUpload({
                async: {
                    saveUrl: "/teachers/upload/",
                    removeUrl: "/teachers/remove/",
                    autoUpload: true,
                },
                validation: {
                    allowedExtensions: [".jpg", ".jpeg", ".png", ".bmp", ".gif"]
                },
                upload: function (e){
                    // insert csrftoken into form before upload
                    e.data = {
                      csrfmiddlewaretoken: csrftoken
                    }
                }, 
                //template: kendo.template($('#fileTemplate').html()),
                success: function (data){
                    //display image
                    e.container.find('img').attr('src', data.response.url);
                    e.container.find('img').attr('value', data.response.pk);
                    //update datasource
                    e.model.image = [data.response.pk];
                    e.model.imageUrl = data.response.url; 
                    //mark data item as changed
                    e.model.dirty = true;
                }, 
                remove: function (e) {
                    //send file's primary key to facilitate removal
                    var fileId = $('div.image-field img').attr('value');
                    e.data = {pk: fileId};
                }, 
                multiple: false,
                localization: {
                    dropFilesHere: ""
                }
            });
            //gender select
            e.container.find('select#gender-select').kendoDropDownList({
                valuePrimitive: true,
                dataTextField: 'text',
                dataValueField: 'value',
                optionLabel: 'Gender',
                dataSource: {
                    data: [
                        {'value': 'M', 'text': 'Male'}, 
                        {'value': 'F', 'text': 'Female'}
                    ]
                }
            });
            //religion select
            e.container.find('select#religion-select').kendoDropDownList({
                valuePrimitive: true,
                dataTextField: 'text',
                dataValueField: 'value',
                optionLabel: 'Religion',
                dataSource: {
                    data: [
                        {'value': 'I', 'text': 'Islam'}, 
                        {'value': 'C', 'text': 'Christianity'},
                        {'value': 'H', 'text': 'Hinduism'}
                    ]
                }
            });
            e.container.find('select#nationality-select').kendoDropDownList({
                valuePrimitive: true,
                dataTextField: 'text',
                dataValueField: 'value',
                optionLabel: 'Nationality',
                dataSource: {
                    data: [
                        {'value': 'Pashtun', 'text': 'Pashtun'}, 
                        {'value': 'Tajik', 'text': 'Tajik'},
                        {'value': 'Hazara', 'text': 'Hazara'},
                        {'value': 'Uzbik', 'text': 'Uzbik'}, 
                        {'value': 'Turkman', 'text': 'Turkman'},
                        {'value': 'Pashaee', 'text': 'Pashaee'},
                        {'value': 'Noristani', 'text': 'Noristani'}, 
                        {'value': 'Imaq', 'text': 'Imaq'},
                        {'value': 'Qazalbash', 'text': 'Qazalbash'},
                        {'value': 'Other', 'text': 'Other'} 
                    ]
                }
            });
            // date-pickers
            e.container.find('input#dob-picker').kendoDatePicker({
                format: "yyyy-MM-dd"
            });
            e.container.find('input#transfered_in_date-picker').kendoDatePicker({
                format: "yyyy-MM-dd"
            });
            e.container.find('input#transfered_out_date-picker').kendoDatePicker({
                format: "yyyy-MM-dd"
            });
            e.container.find('div#filesGridView').kendoGrid({
                dataSource: new kendo.data.DataSource({
                    transport: {
                        read: function(options){
                            //set files grid to empty (i.e. {}) for new records
                            if (itemID == undefined)
                                return options.success({});
                            $.ajax({
                                url: '/teachers/read-docs',
                                dataType: 'json',
                                data: {
                                    id: itemID
                                },
                                success: function(response){
                                    options.success(response);
                                }, 
                                error: function(response){
                                    alert(response.message);
                                }
                            });
                        }, 
                        update: function(e){

                        },
                        destroy: function(e){

                        },
                        create: function(e){

                        },
                    }, 
                    parameterMap: function(data, operation){
                        return {id: itemID};
                    },
                    schema:{
                        parse: function(response){
                            var records =[];
                            for (var i = 0; i < response.length; i++){
                                var fileName = response[i].fields.file.split('/')[response[i].fields.file.split('/').length - 1];
                                var fileType = fileName.split('.')[fileName.split('.').length - 1];
                                var record = {
                                    id: response[i].pk,
                                    url: response[i].fields.file,
                                    fileName: fileName, 
                                    fileType: fileType
                                }
                                records.push(record);
                            }
                            return records;
                        }
                    }, 
                    models:{
                        id: "id", 
                        fields:{
                            fileName: {editable:false}, 
                            fileType: { editable: false}
                        }
                    }
                }),
                // pageable: true, 
                sortable: true, 
                height: 200,
                // toolbar: ["create"],
                columns: [
                    {field: 'fileName', title: "File Name"},
                    {command: [
                            {
                                name: 'download',
                                text: '',
                                click: downloadDoc,
                                // iconClass:'k-icon k-i-view',
                                // width:10,
                                template: "<a class='k-grid-download k-button-icontext' href='\\#'><span class='k-icon k-i-preview'></span></a>"
                            },
                            {
                                name: 'destroy',
                                text: '',
                                // iconClass: 'k-icon k-i-delete',
                                // width:10,
                                template: "<a class='k-grid-delete k-button-icontext' href='\\#'><span class='k-icon k-i-delete'></span></a>"
                            }
                        ], 
                        title: " ", 
                        width: 60
                    }
                ],
                messages: {
                    commands: {
                        edit: "view"
                    }
                },
                editable: {
                    mode: 'inline'
                },
                remove: function(e){
                    $.ajax({
                        url: '/teachers/delete-doc',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            id: e.model.id
                        },
                        success: function(response){
                            return;
                        }, 
                        error: function(response){
                            alert(response.message);
                        }
                    });
                },
            });
            e.container.find('#documentUpload').kendoUpload({
                async: {
                    saveUrl: "/teachers/upload-doc",
                    removeUrl: "/teachers/remove-doc",
                    autoUpload: true,
                },
                upload: function (event){
                    // insert csrftoken into form before upload
                    event.data = {
                      csrfmiddlewaretoken: csrftoken,
                      //insert student id
                      id: e.model.id 
                    }
                },
                success: function (data){
                    //refresh files table
                    e.container.find('#filesGridView')
                    .data('kendoGrid')
                    .dataSource.read();
                }, 
                remove: function (event) {
                    event.preventDefault();
                    //remove uploaded file from UI
                    e.container.find('#documentUpload')
                    .data('kendoUpload')
                    .clearFileByUid(event.files[0].uid);
                }, 
                multiple: true,
                validation: {
                    allowedExtensions: [".jpg", ".png", ".bmp", ".gif", ".doc", ".docx", ".xls", "xlsx", ".pdf", ".jpeg", ".zip"],
                    // maxFileSize: 900000,
                    // minFileSize: 300000
                }, 
                localization: {
                    dropFilesHere: "Drop files here to upload"
                }, 
                enabled: docUploadEnabled
            });
        },
        pageable:{
            refresh: true,
            pageSize: true, 
            buttonCount: 5, 
        }

    });
});