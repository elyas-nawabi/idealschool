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

    //datasource for grid
    var gridDataSource = new kendo.data.DataSource({
        transport: {
            read:  {
                url: '/students/records/',
                dataType: "json"
            },
            update: {
                url: '/students/update/',
                type: 'post',
                dataType: "json", 
            },
            destroy: {
                url: '/students/destroy/',
                type: 'post',
                dataType: "json"
            },
            create: {
                url: '/students/create/',
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
                    data.transfered_out_date = kendo.toString(data.transfered_out_date, "yyyy-MM-dd");
                    data.transfered_in_date = kendo.toString(data.transfered_in_date, "yyyy-MM-dd");
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
                    data.transfered_out_date = kendo.toString(data.transfered_out_date, "yyyy-MM-dd");
                    data.transfered_in_date = kendo.toString(data.transfered_in_date, "yyyy-MM-dd");
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
                        model: 'studentdirectory.student', 
                        fields: data
                    }
                    return {models: kendo.stringify([result]/*server expects array*/)}
                }else if(operation == 'destroy'){

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
                        name: response[i].fields.name,
                        roll_no: response[i].fields.roll_no,
                        f_name: response[i].fields.f_name,
                        gf_name: response[i].fields.gf_name,
                        dob: response[i].fields.dob,
                        gender: response[i].fields.gender, 
                        nid_no: response[i].fields.nid_no, 
                        nationality: response[i].fields.nationality, 
                        religion: response[i].fields.religion,
                        phone: response[i].fields.phone,
                        email: response[i].fields.email,
                        current_add: response[i].fields.current_add,
                        permanent_add: response[i].fields.permanent_add,
                        image: image,
                        imageUrl: imageUrl,
                        emg_contact1_name: response[i].fields.emg_contact1_name,
                        emg_contact1_phone_1: response[i].fields.emg_contact1_phone_1,
                        emg_contact1_phone_2: response[i].fields.emg_contact1_phone_2,
                        emg_contact1_relation: response[i].fields.emg_contact1_relation,
                        emg_contact2_name: response[i].fields.emg_contact2_name,
                        emg_contact2_phone_1: response[i].fields.emg_contact2_phone_1,
                        emg_contact2_phone_2: response[i].fields.emg_contact2_phone_2,
                        emg_contact2_relation: response[i].fields.emg_contact2_relation,
                        blood_group: response[i].fields.blood_group,
                        alergies: response[i].fields.alergies,
                        medications: response[i].fields.medications,
                        medical_conditions: response[i].fields.medical_conditions,
                        transfered_in_date: response[i].fields.transfered_in_date,
                        transfered_in_from_school: response[i].fields.transfered_in_from_school,
                        transfered_in_reason: response[i].fields.transfered_in_reason,
                        transfered_out_date: response[i].fields.transfered_out_date,
                        transfered_out_to_school: response[i].fields.transfered_out_to_school,
                        transfered_out_reason: response[i].fields.transfered_out_reason,
                    }
                    records.push(record);
                }
                return records;
            },
            model: {
                id: "id",
                fields: {
                    roll_no: { editable: true, nullable: true },
                    name: { validation: { required: true } },
                    f_name: { validation: { required: true} },
                    dob: { validation: { required: true} },
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
            { field:"roll_no", title: "Roll No." },
            { field: "name", title:"Name" },
            { field: "f_name", title:"Father's Name" },
            { field: "dob", title: "Date of Birth"},
            { command: ["edit"], title: "&nbsp;"}],
        messages: {
          commands:{
            edit: "View"
          }
        },
        editable: {
            mode:"popup",
            template: kendo.template($('#popup-editor').html()),
            window: {
                title: 'Student details',
                actions: ['Maximize', 'Close'], 
                width: '70%'
            }
        },
        edit: function (e){
            //kendo tabstrip initialization
            e.container.find("#tabstrip").kendoTabStrip().data('kendoTabStrip').activateTab('#tab1');

            //
            if(!e.model.isNew()){

            }
            //kendo async file upload
            e.container.find("#files").kendoUpload({
                async: {
                    saveUrl: "/students/upload/",
                    removeUrl: "/students/remove/",
                    autoUpload: true,
                },
                upload: function (e){
                    // insert csrftoken into form before upload
                    e.data = {
                      csrfmiddlewaretoken: csrftoken
                    }
                }, 
                template: kendo.template($('#fileTemplate').html()),
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
                validation: {
                    allowedExtensions: [".jpg", ".png"],
                    // maxFileSize: 900000,
                    // minFileSize: 300000
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

        },
        pageable:{
            refresh: true,
            pageSize: true, 
            buttonCount: 5, 
        }

    });
});