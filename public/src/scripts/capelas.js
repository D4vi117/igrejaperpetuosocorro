const locales = [
    {
        nome: "Igreja Nossa Senhora do Perpétuo Socorro e<br>São Judas Tadeu",
        mapa: `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7359.392192912678!2d-43.501861!3d-22.7395344!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x995d7557630609%3A0xbb628aee99177a10!2sIgreja%20Nossa%20Senhora%20do%20Perp%C3%A9tuo%20Socorro%20e%20S%C3%A3o%20Judas%20Tadeu!5e0!3m2!1spt-BR!2sbr!4v1737036550216!5m2!1spt-BR!2sbr`,
    },
    {
        nome:"Capela de São José",
        mapa:`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7359.293240000461!2d-43.5144267471217!3d-22.741372436865497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x995d636af8b1fb%3A0x6369a9624ff0d93f!2zQ2FwZWxhIGRlIFPDo28gSm9zw6k!5e0!3m2!1spt-BR!2sbr!4v1737037043892!5m2!1spt-BR!2sbr`
    },
    {
        nome:"Capela de Nossa Senhora de Lourdes e<br>São Pio de Pietrelcina",
        mapa:`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.3973817337223!2d-43.520835688701666!3d-22.75062943222353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x995db74b7f532d%3A0x1455998858f89fc5!2sCapela%20de%20Nossa%20Senhora%20de%20Lourdes%20e%20S%C3%A3o%20Pio%20de%20Pietrelcina%20(Administra%C3%A7%C3%A3o%20Apost%C3%B3lica)!5e0!3m2!1spt-BR!2sbr!4v1737046565575!5m2!1spt-BR!2sbr`
    },
    {
        nome:"Capela Nossa Senhora das Graças e<br>São Sebastião",
        mapa:`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3678.85787571496!2d-43.518153!3d-22.770655100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x995dd5db69737d%3A0xf7cb58b10094dbb6!2sCapela%20Nossa%20Senhora%20das%20Gra%C3%A7as%20e%20S%C3%A3o%20Sebasti%C3%A3o!5e0!3m2!1spt-BR!2sbr!4v1737046675188!5m2!1spt-BR!2sbr`
    },
    {
        nome:"Capela de Nossa Senhora do Rosário",
        mapa:`https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1733.3946951466103!2d-43.49837256390353!3d-22.751644691232197!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x995d007848c167%3A0xe0dae657a4efc768!2sCapela%20de%20Nossa%20Senhora%20do%20Ros%C3%A1rio!5e0!3m2!1spt-BR!2sbr!4v1737047701373!5m2!1spt-BR!2sbr`
    },
    {
        nome:"Capela de São Pedro",
        mapa:`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.635332314788!2d-43.5271246!3d-22.8899257!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9be104780b8e6b%3A0x94cec4d747a899cf!2sCapela%20de%20S%C3%A3o%20Pedro!5e0!3m2!1spt-BR!2sbr!4v1737046966624!5m2!1spt-BR!2sbr`
    }    
]

var localeIndex = 0;

function changeLocation(value) {
    localeIndex = (localeIndex + value + locales.length) % locales.length;
    document.getElementById("mapframe").setAttribute("src", locales[localeIndex].mapa);
    document.getElementById("chapelName").innerHTML = locales[localeIndex].nome;
}
changeLocation(0)