firebase.initializeApp({
    apiKey: 'AIzaSyA5nkm_K6mEiqmRI3Og8LWVCD-MMLPW70k',
    authDomain: 'medicapp-4317f.firebaseapp.com',
    databaseURL: 'https://medicapp-4317f.firebaseio.com'
});
var users = firebase.database().ref('users');


function user(edad, idUsuario, sexo, numeroPastillas, icm) {
    this.edad = edad;
    this.sexo = sexo;
    this.idUsuario = idUsuario;
    this.numeroPastillas = numeroPastillas
    this.icm = icm


}



function frecuencia(edad, idUsuario, frecuencia, hora, sexo, icm) {
    this.edad = edad;
    this.sexo = sexo;
    this.idUsuario = idUsuario;
    this.frecuencia = frecuencia;
    this.hora = hora;
    this.icm = icm

}

function pastillaLog(edad, idUsuario, medicamento, fecha, sexo, icm) {
    this.edad = edad;
    this.idUsuario = idUsuario;
    this.sexo = sexo;
    this.nombreMedicamento = medicamento;
    this.fecha = fecha;
    this.icm = icm

}

function pastilla(edad, idUsuario, medicamento, hora, sexo, icm) {
    this.edad = edad;
    this.idUsuario = idUsuario;
    this.nombreMedicamento = medicamento;
    this.hora = hora;
    this.sexo = sexo;
    this.icm = icm

}

var frecuenciasLista =  []
var pastillasLista = []
var pastillaLogLista  = []
var usersList  = []
var edadLogs = []


function datosEdad(edad, mujer, hombre, numeroPacientes) {
    this.edad = edad;
    this.numeroMujeres = mujer;
    this.numeroHombres = hombre;
    this.numeroPacientes = numeroPacientes


}

function cargar() {

    for (i = 0; i < 120; i++)
    {

        log = new datosEdad(i,0,0,0, 0)

        edadLogs.push(log)

    }

    users.on('value', function(snapshot) {

        let objKey = Object.keys(snapshot.val());
        let objval = Object.values(snapshot.val())


        for(obj in objKey){
            let key = objKey[obj];
            let val = objval[obj];

            var idUsuario = key
            var edad = parseInt(val.perfil.edad)
            var sexo = val.perfil.sexo
            var altura = parseInt(val.perfil.altura)
            var peso =  parseInt(val.perfil.peso)
            var icm =  peso /(altura*altura)

            if(edadLogs[edad] !== undefined) {
                edadLogs[edad].numeroPacientes = edadLogs[edad].numeroPacientes + 1


                if (sexo === "m") {

                    edadLogs[edad].numeroHombres = edadLogs[edad].numeroHombres + 1
                } else {
                    edadLogs[edad].numeroMujeres = edadLogs[edad].numeroMujeres + 1
                }

            }

            logFrecuenciaCardiaca = val.frecuencia_cardiaca
            logPastillas = val.logPastillas
            pastillas = val.pastillasLista



            for (t in logFrecuenciaCardiaca)
            {
                var hora =  new Date(t)

                var frecuenciaLog =  parseInt(logFrecuenciaCardiaca[t].frecuencia)



                h = new frecuencia(edad, idUsuario, frecuenciaLog, hora, sexo, icm)

                frecuenciasLista.push(h)



            }

            for (g in logPastillas)
            {
                var hora =  new Date(g);
                var nombreMedicamento = logPastillas[g].nombreMedicamento

                j = new pastillaLog(edad, idUsuario, nombreMedicamento, hora, sexo, icm)

                pastillaLogLista.push(j)

            }


            var numeroPastillas = 0
            for (h in pastillas)
            {
                numeroPastillas = numeroPastillas + 1
                var nombreMedicamento1 = pastillas[h].nombre
                var hora =  pastillas[h].hora.split(":")[0]
                var minuto =  pastillas[h].hora.split(":")[1]



                var hora2 = parseInt(hora)
                var minuto2 = parseInt(minuto)
                horaTime = new Date()
                horaTime.setHours(hora2,minuto2)

                k = new pastilla(edad,idUsuario, nombreMedicamento1, horaTime, sexo, icm)

                pastillasLista.push(k)
            }



            var userLog = new user(edad,idUsuario,sexo, numeroPastillas, icm)
            usersList.push(userLog)

        }



    });


}




function problemasCardiacosHora(){


    tabla = []
    grafica = []
    for (i = 0; i < 24; i++)
    {
        registroHora = [i,0]
        grafica.push(registroHora)
    }
    console.log(grafica)

    for(d in frecuenciasLista)
    {


        hora = parseInt(frecuenciasLista[d].hora.getHours())

        frecuencia_Cardiaca = parseInt(frecuenciasLista[d].frecuencia)


        log = { "frecuencia":frecuenciasLista[d].frecuencia, "edad":frecuenciasLista[d].edad, "hora": hora };

        tabla.push(log)

        if(frecuencia_Cardiaca < 60 || frecuencia_Cardiaca > 100 ){

            grafica[hora][1] = grafica[hora][1]+ 1

        }


    }


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla
            },
            "slice": {
                "rows": [

                    {
                        "uniqueName": "hora"
                    }, {
                        "uniqueName": "frecuencia"
                    }
                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [
                    {
                        "uniqueName": "frecuencia",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Promedio de la Frecuencia Cardíaca"
                    },
                    {
                        "uniqueName": "hora",
                        "aggregation": "count",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    },
                    {
                        "uniqueName": "edad",
                        "aggregation": "percent",
                        "format": "currency",
                        "grandTotalCaption": "Porcentaje"
                    }]


            }
        }
    });





    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Número de personas que presentaron anomalias cardíacas por hora'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Número de casos de anomalias cardíacas por hora'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Número de casos de anomalias cardíacas por hora'
        },
        series: [{
            name: 'Número de casos de anomalias cardíacas por hora',
            data: grafica,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });



}

function problemasCardiacosEdad(){


    tabla1 = []
    grafica1 = []
    for (i = 0; i < 120; i++)
    {
        registroHora = [i,0]
        grafica1.push(registroHora)
    }


    for(d in frecuenciasLista)
    {


        edad = parseInt(frecuenciasLista[d].edad)

        if (grafica1[edad] != undefined) {

            frecuencia_Cardiaca = parseInt(frecuenciasLista[d].frecuencia)


            log = {
                "frecuencia": frecuenciasLista[d].frecuencia,
                "edad": frecuenciasLista[d].edad,
                "sexo": frecuenciasLista[d].sexo
            };

            tabla1.push(log)

            if(frecuencia_Cardiaca < 60 || frecuencia_Cardiaca > 100 ){

                grafica1[edad][1] = grafica1[edad][1] + 1



            }


        }



    }

    console.log("paso")


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [

                    {
                        "uniqueName": "edad"
                    },
                    {
                        "uniqueName": "sexo"
                    },
                    {
                        "uniqueName": "frecuencia"
                    }
                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [
                    {
                        "uniqueName": "frecuencia",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Promedio de la frecuencia cardíaca"
                    },
                    {
                        "uniqueName": "edad",
                        "aggregation": "count",
                        "format": "currency",
                        "grandTotalCaption": "Número de casos"
                    }]


            }
        }
    });





    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Número de personas que presentaron anomalias cardíacas por edad'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Número de personas que presentaron anomalias cardíacas por edad'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Número de casos anomalias cardíacas'
        },
        series: [{
            name: 'Número de personas que presentaron anomalias cardíacas por edad',
            data: grafica1,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });



}

function frecuenciaCardiacaEdad(){


    tabla2 = []
    grafica2 = []
    graficatemp = []
    for (i = 0; i < 120; i++)
    {
        registroHora = [i,0]
        registroTemp = [i,0,0]
        grafica2.push(registroHora)
        graficatemp.push(registroTemp)
    }


    for(d in frecuenciasLista)
    {


        edad = parseInt(frecuenciasLista[d].edad)

        if (grafica2[edad] != undefined && graficatemp[edad] != undefined) {

            frecuencia_Cardiaca = parseInt(frecuenciasLista[d].frecuencia)


            log = {
                "frecuencia": frecuenciasLista[d].frecuencia,
                "edad": frecuenciasLista[d].edad,
                "sexo": frecuenciasLista[d].sexo,

            };

            tabla2.push(log)
            graficatemp[edad][1] =  graficatemp[edad][1] + 1
            graficatemp[edad][2] =  graficatemp[edad][2] + frecuencia_Cardiaca
            grafica2[edad][1] = graficatemp[edad][2]/graficatemp[edad][1]

        }



    }

    console.log("paso")


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla2
            }
            ,
            "slice": {
                "rows": [
                    {
                        "uniqueName": "edad"
                    },
                    {
                        "uniqueName": "sexo"
                    }
                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [
                    {
                        "uniqueName": "frecuencia",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Promedio de la frecuencia cardíaca"
                    },
                    {
                        "uniqueName": "edad",
                        "aggregation": "percent",
                        "format": "currency",
                        "grandTotalCaption": "Número de casos"
                    }]


            }}

    });





    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Frecuencia Cardíaca Promedio por Edad'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Frecuencia Cardíaca Promedio '
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Frecuencia Cardíaca Promedio por Edad'
        },
        series: [{
            name: 'Frecuencia Cardíaca Promedio por Edad',
            data: grafica2,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });



}



function problemasCardiacosFecha(){


    tabla = []
    grafica = []


    for(d in frecuenciasLista)
    {



        time = new Date(frecuenciasLista[d].hora.getFullYear(),frecuenciasLista[d].hora.getMonth(),
            frecuenciasLista[d].hora.getHours()
            )

        timeStamp = time.getTime()

        frecuencia_Cardiaca = parseInt(frecuenciasLista[d].frecuencia)

        log = { "frecuencia":frecuenciasLista[d].frecuencia, "edad":frecuenciasLista[d].edad, "hora": frecuenciasLista[d].hora };

        tabla.push(log)

        if(frecuencia_Cardiaca < 60 || frecuencia_Cardiaca > 100 ){



            console.log(grafica)
            encontro = false

            for (i = 0; i < grafica.length && encontro == false; i++) {
                if (grafica[i][0] === timeStamp)
                {
                    grafica[i][1] =  grafica[i][1] +1
                    encontro = true
                }

            }
            if (encontro== false)
            {
                y = [timeStamp,1]
                grafica.push(y)
            }



        }


    }


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        width:900,

        report: {
            dataSource: {
                data: tabla
            },
            "slice": {
                "rows": [

                    {
                        "uniqueName": "hora.Year"
                    }, {
                        "uniqueName": "hora.Month"
                    },
                    {
                        "uniqueName": "hora.Day"
                    }
                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [
                    {
                        "uniqueName": "frecuencia",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Promedio de la frecuencia cardíaca"
                    },{
                        "uniqueName": "edad",
                        "aggregation": "count",
                        "format": "currency",
                        "grandTotalCaption": "Número de casos"
                    }]


        }}
    });





    var chart = Highcharts.stockChart('container', {

        chart: {
            height: 400
        },

        title: {
            text: 'Irregularidades cardíacas'
        },

        subtitle: {
            text: 'Número de irregularidades cardíacas en el tiempo'
        },

        rangeSelector: {
            selected: 1
        },

        series: [{
            name: 'Número de Irregularidades cardíacas',
            data: grafica,
            type: 'spline',
            threshold: null,
            tooltip: {
                valueDecimals: 2
            }
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: 300
                    },
                    subtitle: {
                        text: null
                    },
                    navigator: {
                        enabled: false
                    }
                }
            }]
        }
    });





    chart.setSize(800);


}


function medicamentosMasConsumidos(){


    tabla1 = []
    grafica1 = []



    for(d in pastillasLista)
    {
        encontro = false
        for (i = 0; i < grafica1.length && encontro == false; i++) {
            if (pastillasLista[d]=== grafica1[i])
            {
                grafica1[i][1] =  grafica1[i][1] +1
                encontro = true
            }

        }
        if (encontro === false)
        {
            y = [pastillasLista[d].nombreMedicamento,1]
            grafica1.push(y)
        }




            log = {
                "medicamento": pastillasLista[d].nombreMedicamento,
                "hora": pastillasLista[d].hora,
                "sexo": pastillasLista[d].sexo,
                "edad":pastillasLista[d].edad
            };


            tabla1.push(log)







    }

    console.log("paso")


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [
                    {
                        "uniqueName": "medicamento"
                    },

                    {
                        "uniqueName": "edad"
                    },
                    {
                        "uniqueName": "sexo"
                    }


                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [

                    {
                        "uniqueName": "edad",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Edad promedio de los pacientes"
                    },
                    {
                        "uniqueName": "medicamento",
                        "aggregation": "count",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes que usan el medicamento"
                    }]


            }
        }
    });





    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Número de personas que usan cada medicamento'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Número de personas que usan cada medicamento'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Número de personas '
        },
        series: [{
            name: 'Número de personas que usan cada medicamento',
            data: grafica1,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });

}

function numeroPromedioMedicamentosEdad(){


    tabla2 = []
    grafica2 = []
    graficatemp = []
    for (i = 0; i < 120; i++)
    {
        registroHora = [i,0]
        registroTemp = [i,0,0]
        grafica2.push(registroHora)
        graficatemp.push(registroTemp)
    }


    for(d in usersList)
    {


        edad = parseInt(usersList[d].edad)

        if (grafica2[edad] != undefined && graficatemp[edad] != undefined) {

            listaMedicamentos = usersList[d].numeroPastillas


            log = {
                "usuario": usersList[d].idUsuario,
                "edad": usersList[d].edad,
                "sexo": usersList[d].sexo,
                "numero de pastillas" : usersList[d].numeroPastillas

            };

            tabla2.push(log)
            graficatemp[edad][1] =  graficatemp[edad][1] + 1
            graficatemp[edad][2] =  graficatemp[edad][2] + listaMedicamentos
            grafica2[edad][1] = graficatemp[edad][2]/graficatemp[edad][1]

        }



    }







    console.log("paso")


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla2
            },
            "slice": {
                "rows": [


                    {
                        "uniqueName": "edad"
                    },
                    {
                        "uniqueName": "sexo"
                    },
                    {
                        "uniqueName": "usuario"
                    }


                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [

                    {
                        "uniqueName": "edad",
                        "aggregation": "count",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    },
                    {
                        "uniqueName": "numero de pastillas",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Número promedio de medicamentos"
                    }]


            }
        }
    });





    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Número de promedio de medicamentos que usa cada persona por edad'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Número promedio de medicamentos que usa cada persona por edad'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Número promedio de medicamentos'
        },
        series: [{
            name: 'Número promedio de medicamentos que usa cada persona por edad',
            data: grafica2,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });

}

function medicamentosLogsHora(){


    tabla1 = []
    noTiempo = []
    tiempo = []
    medicamento = []
    tablatem= []



    for(d in pastillasLista)
    {
        encontro = false
        for (i = 0; i < tabla1.length; i++) {
            if (pastillasLista[d] === tabla1[i] )
            {
                if ( pastillasLista[d].idUsuario != tablatem[i].idUsuario)
                {
                    tablatem[i].sumaEdad = tablatem[i].sumaEdad + pastillasLista[d].edad
                    tablatem[i].numeroDePacientes = tablatem[i].numeroDePacientes +1
                    grafica1[i].promedioEdad = tablatem[i].sumaEdad / tablatem[i].numeroDePacientes

                }

                encontro = true
            }

        }
        if (encontro === false)
        {

            medicamento.push(pastillasLista[d].nombreMedicamento)
            tiempo.push(0)
            noTiempo.push(0)
            log = {
                "medicamento": pastillasLista[d].nombreMedicamento,
                "hora": pastillasLista[d].hora,
                "tiempo": 0,
                "noTiempo":0,
                "promedioEdad":pastillasLista[d].edad,
                "numeroDePacientes" : 1
            };

            log2 = {

                "sumaEdad":pastillasLista[d].edad,
                "numeroDePacientes" : 1,
                "idUsuario": pastillasLista[d].idUsuario

            };

            tabla1.push(log)
            tablatem.push(log2)
        }



    }

    for (t in pastillaLogLista)
    {
        fechaLog =pastillaLogLista[t].fecha
        for (c in tabla1)
        {


            if(pastillaLogLista[t].nombreMedicamento === tabla1[c].medicamento)
            {

                hora = tabla1[c].hora
                diferencia = Math.abs(fechaLog.getMinutes() - hora.getMinutes())
                diferenciahoras= fechaLog.getHours()- hora.getHours()

                console.log(diferenciahoras)
                console.log(diferencia)

                if (diferenciahoras === 0  )
                {

                    if(diferencia < 20){
                        tabla1[c].tiempo =tabla1[c].tiempo +1
                        tiempo[c] =tiempo[c]+1
                    }
                    else
                        {
                            tabla1[c].noTiempo = tabla1[c].noTiempo + 1
                            noTiempo[c] =noTiempo[c]+1
                    }

                }
                else
                    {

                        tabla1[c].noTiempo = tabla1[c].noTiempo + 1
                        noTiempo[c] =noTiempo[c]+1
                }
            }

        }
    }




    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [
                    {
                        "uniqueName": "medicamento"
                    }




                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [

                    {
                        "uniqueName": "promedioEdad",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Edad promedio de los pacientes"
                    },
                    {
                        "uniqueName": "numeroDePacientes",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes que usan el medicamento"
                    },
                    {
                        "uniqueName": "tiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que el medicamento se tomo a tiempo"
                    },{
                        "uniqueName": "noTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que el medicamento NO se tomo a tiempo"
                    }]


            }
        }
    });





    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Número de veces que cada medicamento se tomo a tiempo y número de veces que no'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            categories: medicamento
        },
        yAxis: {
            title: {
                text: 'Número de veces'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: 'Número de veces que el medicamento se tomo a tiempo',
            data: tiempo
        }, {
            name: 'Número de veces que el medicamento NO se tomo a tiempo',
            data: noTiempo
        }]
    });

}

function medicamentosLogsHoraSexo(){


    tabla1 = []
    tablatem= []



    for(d in pastillasLista)
    {
        encontro = false
        for (i = 0; i < tabla1.length; i++) {
            if (pastillasLista[d] === tabla1[i] )
            {
                if ( pastillasLista[d].idUsuario != tablatem[i].idUsuario)
                {

                    if (pastillasLista[d].sexo === "f")
                    {
                        tabla1[i].numeroPacientesFem = tabla1[i].numeroPacientesFem + 1
                    }
                    else {

                        tabla1[i].numeroDePacientesHombre = tabla1[i].numeroDePacientesHombre + 1
                    }

                    tablatem[i].sumaEdad = tablatem[i].sumaEdad + pastillasLista[d].edad
                    tablatem[i].numeroDePacientes = tablatem[i].numeroDePacientes +1
                    tabla1[i].promedioEdad = tablatem[i].sumaEdad / tablatem[i].numeroDePacientes
                    tabla1[i].numeroDePacientes = tablatem[i].numeroDePacientes

                }

                encontro = true
            }

        }
        if (encontro === false)
        {



            numHombre = 0
            numMujer = 0
            if (pastillasLista[d].sexo === "f")
            {
                numMujer = 1
            }
            else {
                numHombre = 1
            }
            log = {
                "medicamento": pastillasLista[d].nombreMedicamento,
                "hora": pastillasLista[d].hora,
                "tiempo": 0,
                "noTiempo":0,
                "promedioEdad":pastillasLista[d].edad,
                "numeroDePacientes" : 1,
                "numeroPacientesFem": numMujer,
                "numeroPacientesMas": numHombre,
                "numeroMujerTiempo":0,
                "numeroHombreTiempo":0,
                "numeroMujerNoTiempo":0,
                "numeroHombreNoTiempo":0
            };

            log2 = {

                "sumaEdad":pastillasLista[d].edad,
                "numeroDePacientes" : 1,
                "idUsuario": pastillasLista[d].idUsuario

            };

            tabla1.push(log)
            tablatem.push(log2)
        }



    }

    for (t in pastillaLogLista)
    {
        fechaLog =pastillaLogLista[t].fecha
        for (c in tabla1)
        {


            if(pastillaLogLista[t].nombreMedicamento === tabla1[c].medicamento)
            {

                hora = tabla1[c].hora
                sexo = pastillaLogLista[t].sexo
                diferencia = Math.abs(fechaLog.getMinutes() - hora.getMinutes())
                diferenciahoras= fechaLog.getHours()- hora.getHours()

                console.log(diferenciahoras)
                console.log(diferencia)

                if (diferenciahoras === 0  )
                {

                    if(diferencia < 20){
                        tabla1[c].tiempo =tabla1[c].tiempo +1

                        if (sexo === "f")
                        {
                            tabla1[c].numeroMujerTiempo = tabla1[c].numeroMujerTiempo + 1
                        }
                        else {
                            tabla1[c].numeroHombreTiempo = tabla1[c].numeroHombreTiempo +1
                        }

                    }
                    else
                    {
                        tabla1[c].noTiempo = tabla1[c].noTiempo + 1


                        if (sexo === "f")
                        {
                            tabla1[c].numeroMujerNoTiempo = tabla1[c].numeroMujerNoTiempo + 1
                        }
                        else {
                            tabla1[c].numeroHombreNoTiempo = tabla1[c].numeroHombreNoTiempo +1
                        }

                    }

                }
                else
                {

                    tabla1[c].noTiempo = tabla1[c].noTiempo + 1


                    if (sexo === "f")
                    {
                        tabla1[c].numeroMujerNoTiempo = tabla1[c].numeroMujerNoTiempo + 1
                    }
                    else {
                        tabla1[c].numeroHombreNoTiempo = tabla1[c].numeroHombreNoTiempo +1
                    }
                }
            }

        }
    }




    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [
                    {
                        "uniqueName": "medicamento"
                    }





                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [


                    {
                        "uniqueName": "numeroDePacientes",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    },
                    {
                        "uniqueName": "numeroPacientesFem",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes de sexo femenino"
                    },
                    {
                        "uniqueName": "numeroMujerTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que un paciente de sexo femenino tomo el medicamento a tiempo"
                    },
                    {
                        "uniqueName": "numeroMujerNoTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que un paciente de sexo femenino  NO tomo el medicamento a tiempo"
                    },
                    {
                        "uniqueName": "numeroPacientesMas",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes de sexo masculino"
                    },
                    {
                        "uniqueName": "numeroHombreTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que un paciente de sexo masculino  tomo el medicamento a tiempo"
                    },
                    {
                        "uniqueName": "numeroHombreNoTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que un paciente de sexo masculino  NO tomo el medicamento a tiempo"
                    },


                ]


            }
        }
    });







}

function medicamentosLogsHoraEdad(){


    tabla1 = []
    tablaMedicamentos = []
    noTiempo = []
    tiempo = []
    edad = []


    for (i = 0; i < 120; i++)
    {


        edad.push(i)
        tiempo.push(0)
        noTiempo.push(0)


        log = {
            "edad": i,
            "numeroMujerTiempo": 0,
            "numeroHombreTiempo": 0,
            "numeroHombreNoTiempo": 0,
            "numeroMujerNoTiempo": 0,
            "noTiempo":0,
            "tiempo":0,
            "numeroDePacientes" : edadLogs[i].numeroPacientes,
            "numeroDePacientesMujer" : edadLogs[i].numeroMujeres,
            "numeroDePacientesHombre" : edadLogs[i].numeroHombres
        };
        tabla1.push(log)
        edad.push(i)
    }



    for(d in pastillasLista)
    {
        encontro = false
        for (i = 0; i < tabla1.length; i++) {
            if (pastillasLista[d] === tablaMedicamentos[i] )
            {

                encontro = true
            }

        }
        if (encontro === false)
        {


            log = {
                "medicamento": pastillasLista[d].nombreMedicamento,
                "hora": pastillasLista[d].hora,

            };



            tablaMedicamentos.push(log)

        }



    }

    for (t in pastillaLogLista)
    {
        fechaLog =pastillaLogLista[t].fecha
        for (c in tablaMedicamentos)
        {


            if(pastillaLogLista[t].nombreMedicamento === tablaMedicamentos[c].medicamento)
            {

                hora = tablaMedicamentos[c].hora
                edad = pastillaLogLista[t].edad
                sexo = pastillaLogLista[t]. sexo
                diferencia = Math.abs(fechaLog.getMinutes() - hora.getMinutes())
                diferenciahoras= fechaLog.getHours()- hora.getHours()

                if(tabla1[edad] !== undefined && tiempo[edad] !== undefined && noTiempo[edad] !== undefined ){

                    if (diferenciahoras === 0  )
                    {


                        if(diferencia < 20){
                            tabla1[edad].tiempo = tabla1[edad].tiempo +1
                            tiempo[edad] = tiempo[edad]+1
                            if (sexo === "f")
                            {
                                tabla1[edad].numeroMujerTiempo = tabla1[edad].numeroMujerTiempo + 1
                            }
                            else {
                                tabla1[edad].numeroHombreTiempo = tabla1[edad].numeroHombreTiempo +1
                            }
                        }
                        else
                        {
                            tabla1[edad].noTiempo = tabla1[edad].noTiempo + 1
                            noTiempo[edad] =noTiempo[edad]+1

                            if (sexo === "f")
                            {
                                tabla1[edad].numeroMujerNoTiempo = tabla1[edad].numeroMujerNoTiempo + 1
                            }
                            else {
                                tabla1[edad].numeroHombreNoTiempo = tabla1[edad].numeroHombreNoTiempo +1
                            }

                        }

                    }
                    else
                    {

                        tabla1[c].noTiempo = tabla1[c].noTiempo + 1
                        noTiempo[c] =noTiempo[c]+1

                        if (sexo === "f")
                        {
                            tabla1[edad].numeroMujerNoTiempo = tabla1[edad].numeroMujerNoTiempo + 1
                        }
                        else {
                            tabla1[edad].numeroHombreNoTiempo = tabla1[edad].numeroHombreNoTiempo +1
                        }

                    }
                }
            }

        }
    }




    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [
                    {
                        "uniqueName": "edad"
                    },
                    {
                        "uniqueName": "sexo"
                    }





                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [


                    {
                        "uniqueName": "numeroDePacientes",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    },
                    {
                        "uniqueName": "tiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que los pacientes tomaron el medicamento a tiempo"
                    },{
                        "uniqueName": "noTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que los pacientes NO tomaron el medicamento a tiempo"
                    }]


            }
        }
    });





    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Número de veces que el paciente se tomo a tiempo el medicamento y número de veces que no por edad'
        },
        subtitle: {
            text: ""
        },
        xAxis: {
            categories: edad
        },
        yAxis: {
            title: {
                text: 'Numero de veces'
            }
        },
        tooltip: {
            crosshairs: true,
            shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                }
            }
        },
        series: [{
        name: 'Número de veces que el medicamento se tomo a tiempo',
        data: tiempo
    }, {
        name: 'Número de veces que el medicamento NO se tomo a tiempo',
        data: noTiempo
    }]
    });

}

function medicamentosLogsHoraEdadSexo(){


    tabla1 = []
    tablaMedicamentos = []
    tiempoM = []
    tiempoF = []
    edad = []


    for (i = 0; i < 120; i++)
    {


        edad.push(i)



        log = {
            "edad": i,
            "numeroMujerTiempo": 0,
            "numeroHombreTiempo": 0,
            "numeroHombreNoTiempo": 0,
            "numeroMujerNoTiempo": 0,
            "noTiempo":0,
            "tiempo":0,
            "numeroDePacientes" : edadLogs[i].numeroPacientes,
            "numeroDePacientesMujer" : edadLogs[i].numeroMujeres,
            "numeroDePacientesHombre" : edadLogs[i].numeroHombres
        };
        tabla1.push(log)
        edad.push(i)
    }



    for(d in pastillasLista)
    {
        encontro = false
        for (i = 0; i < tabla1.length; i++) {
            if (pastillasLista[d] === tablaMedicamentos[i] )
            {

                encontro = true
            }

        }
        if (encontro === false)
        {


            log = {
                "medicamento": pastillasLista[d].nombreMedicamento,
                "hora": pastillasLista[d].hora,

            };



            tablaMedicamentos.push(log)

        }



    }

    for (t in pastillaLogLista)
    {
        fechaLog =pastillaLogLista[t].fecha
        for (c in tablaMedicamentos)
        {


            if(pastillaLogLista[t].nombreMedicamento === tablaMedicamentos[c].medicamento)
            {

                hora = tablaMedicamentos[c].hora
                edad = pastillaLogLista[t].edad
                sexo = pastillaLogLista[t]. sexo
                diferencia = Math.abs(fechaLog.getMinutes() - hora.getMinutes())
                diferenciahoras= fechaLog.getHours()- hora.getHours()

                if(tabla1[edad] !== undefined ){

                    if (diferenciahoras === 0  )
                    {


                        if(diferencia < 20){
                            tabla1[edad].tiempo = tabla1[edad].tiempo +1

                            if (sexo === "f")
                            {
                                tabla1[edad].numeroMujerTiempo = tabla1[edad].numeroMujerTiempo + 1
                            }
                            else {
                                tabla1[edad].numeroHombreTiempo = tabla1[edad].numeroHombreTiempo +1
                            }
                        }
                        else
                        {
                            tabla1[edad].noTiempo = tabla1[edad].noTiempo + 1


                            if (sexo === "f")
                            {
                                tabla1[edad].numeroMujerNoTiempo = tabla1[edad].numeroMujerNoTiempo + 1
                            }
                            else {
                                tabla1[edad].numeroHombreNoTiempo = tabla1[edad].numeroHombreNoTiempo +1
                            }

                        }

                    }
                    else
                    {

                        tabla1[c].noTiempo = tabla1[c].noTiempo + 1


                        if (sexo === "f")
                        {
                            tabla1[edad].numeroMujerNoTiempo = tabla1[edad].numeroMujerNoTiempo + 1
                        }
                        else {
                            tabla1[edad].numeroHombreNoTiempo = tabla1[edad].numeroHombreNoTiempo +1
                        }

                    }
                }
            }

        }
    }


    document.getElementById("container").innerHTML = "";

    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [
                    {
                        "uniqueName": "edad"
                    },
                    {
                        "uniqueName": "sexo"
                    }





                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [


                    {
                        "uniqueName": "numeroDePacientes",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    },
                    {
                        "uniqueName": "numeroDePacientesMujer",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes de sexo femenino"
                    },
                    {
                        "uniqueName": "numeroMujerTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que un paciente de sexo femenino tomo el medicamento a tiempo"
                    },
                    {
                        "uniqueName": "numeroMujerNoTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que un paciente de sexo femenino  NO tomo el medicamento a tiempo"
                    },
                    {
                        "uniqueName": "numeroDePacientesHombre",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes de sexo masculino"
                    },
                    {
                        "uniqueName": "numeroHombreTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que un paciente de sexo masculino  tomo el medicamento a tiempo"
                    },
                    {
                        "uniqueName": "numeroHombreNoTiempo",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de veces que un paciente de sexo masculino  NO tomo el medicamento a tiempo"
                    },


                ]


            }
        }
    });







}

function medicamentosnumeroSexo(){


    tabla1 = []
    tablatem= []



    for(d in pastillasLista)
    {
        encontro = false
        for (i = 0; i < tabla1.length; i++) {
            if (pastillasLista[d] === tabla1[i] )
            {
                if ( pastillasLista[d].idUsuario != tablatem[i].idUsuario)
                {

                    if (pastillasLista[d].sexo === "f")
                    {
                        tabla1[i].numeroPacientesFem = tabla1[i].numeroPacientesFem + 1
                    }
                    else {

                        tabla1[i].numeroDePacientesHombre = tabla1[i].numeroDePacientesHombre + 1
                    }

                    tablatem[i].sumaEdad = tablatem[i].sumaEdad + pastillasLista[d].edad
                    tablatem[i].numeroDePacientes = tablatem[i].numeroDePacientes +1
                    tabla1[i].promedioEdad = tablatem[i].sumaEdad / tablatem[i].numeroDePacientes
                    tabla1[i].numeroDePacientes = tablatem[i].numeroDePacientes

                }

                encontro = true
            }

        }
        if (encontro === false)
        {



            numHombre = 0
            numMujer = 0
            if (pastillasLista[d].sexo === "f")
            {
                numMujer = 1
            }
            else {
                numHombre = 1
            }
            log = {
                "medicamento": pastillasLista[d].nombreMedicamento,
                "hora": pastillasLista[d].hora,
                "tiempo": 0,
                "noTiempo":0,
                "promedioEdad":pastillasLista[d].edad,
                "numeroDePacientes" : 1,
                "numeroPacientesFem": numMujer,
                "numeroPacientesMas": numHombre,
                "numeroMujerTiempo":0,
                "numeroHombreTiempo":0,
                "numeroMujerNoTiempo":0,
                "numeroHombreNoTiempo":0
            };

            log2 = {

                "sumaEdad":pastillasLista[d].edad,
                "numeroDePacientes" : 1,
                "idUsuario": pastillasLista[d].idUsuario

            };

            tabla1.push(log)
            tablatem.push(log2)
        }



    }

    for (t in pastillaLogLista)
    {
        fechaLog =pastillaLogLista[t].fecha
        for (c in tabla1)
        {


            if(pastillaLogLista[t].nombreMedicamento === tabla1[c].medicamento)
            {

                hora = tabla1[c].hora
                sexo = pastillaLogLista[t].sexo
                diferencia = Math.abs(fechaLog.getMinutes() - hora.getMinutes())
                diferenciahoras= fechaLog.getHours()- hora.getHours()

                console.log(diferenciahoras)
                console.log(diferencia)

                if (diferenciahoras === 0  )
                {

                    if(diferencia < 20){
                        tabla1[c].tiempo =tabla1[c].tiempo +1

                        if (sexo === "f")
                        {
                            tabla1[c].numeroMujerTiempo = tabla1[c].numeroMujerTiempo + 1
                        }
                        else {
                            tabla1[c].numeroHombreTiempo = tabla1[c].numeroHombreTiempo +1
                        }

                    }
                    else
                    {
                        tabla1[c].noTiempo = tabla1[c].noTiempo + 1


                        if (sexo === "f")
                        {
                            tabla1[c].numeroMujerNoTiempo = tabla1[c].numeroMujerNoTiempo + 1
                        }
                        else {
                            tabla1[c].numeroHombreNoTiempo = tabla1[c].numeroHombreNoTiempo +1
                        }

                    }

                }
                else
                {

                    tabla1[c].noTiempo = tabla1[c].noTiempo + 1


                    if (sexo === "f")
                    {
                        tabla1[c].numeroMujerNoTiempo = tabla1[c].numeroMujerNoTiempo + 1
                    }
                    else {
                        tabla1[c].numeroHombreNoTiempo = tabla1[c].numeroHombreNoTiempo +1
                    }
                }
            }

        }
    }




    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [
                    {
                        "uniqueName": "medicamento"
                    }





                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [


                    {
                        "uniqueName": "numeroDePacientes",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    },
                    {
                        "uniqueName": "numeroPacientesFem",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes de sexo femenino"
                    },


                    {
                        "uniqueName": "numeroPacientesMas",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes de sexo masculino"
                    }



                ]


            }
        }
    });








}

function medicamentosEdadpromedio(){


    tabla1 = []
    tablatem= []



    for(d in pastillasLista)
    {
        encontro = false
        for (i = 0; i < tabla1.length; i++) {
            if (pastillasLista[d] === tabla1[i] )
            {
                if ( pastillasLista[d].idUsuario != tablatem[i].idUsuario)
                {

                    if (pastillasLista[d].sexo === "f")
                    {
                        tabla1[i].numeroPacientesFem = tabla1[i].numeroPacientesFem + 1
                    }
                    else {

                        tabla1[i].numeroDePacientesHombre = tabla1[i].numeroDePacientesHombre + 1
                    }

                    tablatem[i].sumaEdad = tablatem[i].sumaEdad + pastillasLista[d].edad
                    tablatem[i].numeroDePacientes = tablatem[i].numeroDePacientes +1
                    tabla1[i].promedioEdad = tablatem[i].sumaEdad / tablatem[i].numeroDePacientes
                    tabla1[i].numeroDePacientes = tablatem[i].numeroDePacientes

                }

                encontro = true
            }

        }
        if (encontro === false)
        {



            numHombre = 0
            numMujer = 0
            if (pastillasLista[d].sexo === "f")
            {
                numMujer = 1
            }
            else {
                numHombre = 1
            }
            log = {
                "medicamento": pastillasLista[d].nombreMedicamento,
                "hora": pastillasLista[d].hora,
                "tiempo": 0,
                "noTiempo":0,
                "promedioEdad":pastillasLista[d].edad,
                "numeroDePacientes" : 1,
                "numeroPacientesFem": numMujer,
                "numeroPacientesMas": numHombre,
                "numeroMujerTiempo":0,
                "numeroHombreTiempo":0,
                "numeroMujerNoTiempo":0,
                "numeroHombreNoTiempo":0
            };

            log2 = {

                "sumaEdad":pastillasLista[d].edad,
                "numeroDePacientes" : 1,
                "idUsuario": pastillasLista[d].idUsuario

            };

            tabla1.push(log)
            tablatem.push(log2)
        }



    }

    for (t in pastillaLogLista)
    {
        fechaLog =pastillaLogLista[t].fecha
        for (c in tabla1)
        {


            if(pastillaLogLista[t].nombreMedicamento === tabla1[c].medicamento)
            {

                hora = tabla1[c].hora
                sexo = pastillaLogLista[t].sexo
                diferencia = Math.abs(fechaLog.getMinutes() - hora.getMinutes())
                diferenciahoras= fechaLog.getHours()- hora.getHours()

                console.log(diferenciahoras)
                console.log(diferencia)

                if (diferenciahoras === 0  )
                {

                    if(diferencia < 20){
                        tabla1[c].tiempo =tabla1[c].tiempo +1

                        if (sexo === "f")
                        {
                            tabla1[c].numeroMujerTiempo = tabla1[c].numeroMujerTiempo + 1
                        }
                        else {
                            tabla1[c].numeroHombreTiempo = tabla1[c].numeroHombreTiempo +1
                        }

                    }
                    else
                    {
                        tabla1[c].noTiempo = tabla1[c].noTiempo + 1


                        if (sexo === "f")
                        {
                            tabla1[c].numeroMujerNoTiempo = tabla1[c].numeroMujerNoTiempo + 1
                        }
                        else {
                            tabla1[c].numeroHombreNoTiempo = tabla1[c].numeroHombreNoTiempo +1
                        }

                    }

                }
                else
                {

                    tabla1[c].noTiempo = tabla1[c].noTiempo + 1


                    if (sexo === "f")
                    {
                        tabla1[c].numeroMujerNoTiempo = tabla1[c].numeroMujerNoTiempo + 1
                    }
                    else {
                        tabla1[c].numeroHombreNoTiempo = tabla1[c].numeroHombreNoTiempo +1
                    }
                }
            }

        }
    }




    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [
                    {
                        "uniqueName": "medicamento"
                    }





                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [

                    {
                        "uniqueName": "promedioEdad",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Edad promedio"
                    },
                    {
                        "uniqueName": "numeroDePacientes",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    },
                    {
                        "uniqueName": "numeroPacientesFem",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes de sexo femenino"
                    },


                    {
                        "uniqueName": "numeroPacientesMas",
                        "aggregation": "sum",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes de sexo masculino"
                    }



                ]


            }
        }
    });



}





function frecuenciaCardiacaEdadSexo(){


    tabla2 = []
    grafica2 = []
    graficatemp = []
    for (i = 0; i < 120; i++)
    {
        registroHora = [i,0]
        registroTemp = [i,0,0]
        grafica2.push(registroHora)
        graficatemp.push(registroTemp)
    }


    for(d in frecuenciasLista)
    {


        edad = parseInt(frecuenciasLista[d].edad)

        if (grafica2[edad] != undefined && graficatemp[edad] != undefined) {

            frecuencia_Cardiaca = parseInt(frecuenciasLista[d].frecuencia)


            log = {
                "frecuencia": frecuenciasLista[d].frecuencia,
                "edad": frecuenciasLista[d].edad,
                "sexo": frecuenciasLista[d].sexo,

            };

            tabla2.push(log)
            graficatemp[edad][1] =  graficatemp[edad][1] + 1
            graficatemp[edad][2] =  graficatemp[edad][2] + frecuencia_Cardiaca
            grafica2[edad][1] = graficatemp[edad][2]/graficatemp[edad][1]

        }



    }

    console.log("paso")


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla2
            }
            ,
            "slice": {
                "rows": [
                    {
                        "uniqueName": "edad"
                    }
                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    },
                    {
                        "uniqueName": "sexo"
                    }
                ],
                "measures": [
                    {
                        "uniqueName": "frecuencia",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Promedio de la frecuencia cardíaca"
                    },
                    {
                        "uniqueName": "edad",
                        "aggregation": "count",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    }]


            }}

    });








}

function promedioHoraporSexo(){


    tabla = []
    grafica = []
    for (i = 0; i < 24; i++)
    {
        registroHora = [i,0]
        grafica.push(registroHora)
    }
    console.log(grafica)

    for(d in frecuenciasLista)
    {


        hora = parseInt(frecuenciasLista[d].hora.getHours())

        frecuencia_Cardiaca = parseInt(frecuenciasLista[d].frecuencia)


        log = { "frecuencia":frecuenciasLista[d].frecuencia, "edad":frecuenciasLista[d].edad, "hora": hora, "sexo": frecuenciasLista[d].sexo };

        tabla.push(log)

        if(frecuencia_Cardiaca < 60 || frecuencia_Cardiaca > 100 ){

            grafica[hora][1] = grafica[hora][1]+ 1

        }


    }


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla
            },
            "slice": {
                "rows": [

                    {
                        "uniqueName": "hora"
                    }, {
                        "uniqueName": "frecuencia"
                    }
                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [
                    {
                        "uniqueName": "frecuencia",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Promedio de la Frecuencia Cardíaca"
                    },
                    {
                        "uniqueName": "hora",
                        "aggregation": "count",
                        "format": "currency",
                        "grandTotalCaption": "Número de pacientes"
                    },
                    {
                        "uniqueName": "edad",
                        "aggregation": "percent",
                        "format": "currency",
                        "grandTotalCaption": "Porcentaje"
                    }]


            }
        }
    });





    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Número de personas que presentaron anomalias cardíacas por hora'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Número de casos de anomalias cardíacas por hora'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Número de casos Anomalias Cardíacas por hora'
        },
        series: [{
            name: 'Número de casos Anomalias Cardíacas por hora',
            data: grafica,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });



}


function problemasCardiacosEdadICM(){


    tabla1 = []
    grafica1 = []
    for (i = 0; i < 120; i++)
    {
        registroHora = [i,0]
        grafica1.push(registroHora)
    }


    for(d in frecuenciasLista)
    {


        edad = parseInt(frecuenciasLista[d].edad)

        if (grafica1[edad] != undefined) {

            frecuencia_Cardiaca = parseInt(frecuenciasLista[d].frecuencia)


            log = {
                "frecuencia": frecuenciasLista[d].frecuencia,
                "edad": frecuenciasLista[d].edad,
                "sexo": frecuenciasLista[d].sexo
            };

            tabla1.push(log)

            if(frecuencia_Cardiaca < 60 || frecuencia_Cardiaca > 100 ){

                grafica1[edad][1] = grafica1[edad][1] + 1



            }


        }



    }

    console.log("paso")


    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: false,
        report: {
            dataSource: {
                data: tabla1
            },
            "slice": {
                "rows": [

                    {
                        "uniqueName": "edad"
                    },
                    {
                        "uniqueName": "sexo"
                    },
                    {
                        "uniqueName": "frecuencia"
                    }
                ],
                "columns": [
                    {
                        "uniqueName": "Measures"
                    }
                ],
                "measures": [
                    {
                        "uniqueName": "frecuencia",
                        "aggregation": "average",
                        "format": "currency",
                        "grandTotalCaption": "Promedio de la frecuencia cardíaca"
                    },
                    {
                        "uniqueName": "edad",
                        "aggregation": "count",
                        "format": "currency",
                        "grandTotalCaption": "Número de casos"
                    }]


            }
        }
    });





    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Número de personas que presentaron anomalias cardíacas por Edad'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Número de casos de anomalias cardíacas por Edad'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Número de casos anomalias cardiacas'
        },
        series: [{
            name: 'Número de casos anomalias cardíacas por edad',
            data: grafica1,
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y}', // one decimal
                y: 10, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });



}


