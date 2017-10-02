var ttt = {
        layout: 'A4 portrait',
        title: 'A simple example',
        srs: 'EPSG:4326',
        units: 'dd',
        outputFilename: 'mapfish-print',
        outputFormat: 'pdf',
        layers: [
            {
                type: 'WMS',
                format: 'image/png',
                layers: ['m1102va001970_hn'],
                baseURL: 'http://192.168.10.72:8080/geoserver/mosef/wms'
            },
            {
                type: 'WMS',
                format: 'image/png',
                layers: ['m2504va022009_hn'],
                baseURL: 'http://192.168.10.72:8080/geoserver/mosef/wms'
            }
        ],
        pages: [
            {
                center: [-86.922493, 14.790219],
                scale: 4000000,
                dpi: 190,
                mapTitle: "First map",
                comment: "The \"routes\" layer is not shown (the scale is too small)",
                data: [
                    {id:1, name: 'blah', icon: 'icon_pan'},
                    {id:2, name: 'blip', icon: 'icon_zoomin'}
                ]
            },
            {
                center: [6.9, 46.2],
                scale: 500000,
                dpi: 190,
                mapTitle: "Second map",
                comment: "This is a zoomed in version of the first map. Since the scale is more appropriate, we show the \"routes\" layer.",
                data: [
                    {id:1, name: 'blah', icon: 'icon_pan'},
                    {id:2, name: 'blip', icon: 'icon_zoomin'}
                ]
            }
        ]
     };
 