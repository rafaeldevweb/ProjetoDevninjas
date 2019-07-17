/* smooth scroll */
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    /* scrollToTop */

    //Check to see if the window is top if not then display button
	$(window).scroll(function(){
		if ($(this).scrollTop() > 500) {
			$('.scrollToTop').fadeIn();
		} else {
			$('.scrollToTop').fadeOut();
		}
	});
	
	//Click event to scroll to top
	$('.scrollToTop').click(function(){
		$('html, body').animate({scrollTop : 0},800);
		return false;
    });
    
    // Todos os campos a partir do segundo bloco do formulário devem iniciar desabilitado
    $('.disabled').find('input, select, textarea').attr('disabled', true);


    // Evento ao selecionar uma ou mais opções do bloco de Tipos de Projeto
    $('input[name="tipo_projeto[]"]').on('change', function() {
        
        // Quantidade de itens do 1º bloco selecionados
        let checked = $('input[name="tipo_projeto[]"]:checked').length;

        // Verifica quantos itens foram selecionados
        if (checked > 0) {
            // Habilita os campos do 2º bloco
            $('.form-step-2').removeClass('disabled').find('input, select, textarea').attr('disabled', false);


            if ($('input[name="estagio"]:checked').val() === '') {
                // Mantém os campos do 3º bloco desabilitados somente se nenhuma opção do 2º bloco
                // estiver selecionada
                $('.form-step-3').addClass('disabled').find('input, select, textarea').attr('disabled', true);
            }
        } else {
            // Se não tiver nenhum campo do 1º bloco selecionado, reseta os estados dos campos dos 
            // outros blocos do formulário
            $('.form-step-2').addClass('disabled').find('input, select, textarea').attr('disabled', true);
            $('.form-step-3').addClass('disabled').find('input, select, textarea').attr('disabled', true);
            
            // Reseta os campos do segundo bloco do formulário
            $('input[name="estagio"]').attr('checked', false);

            // Desabilita o botão de submit até que alguma opção do 2º bloco seja selecionada
            $('input[type="submit"]').attr('disabled', true);
        }
    });

    // Evento ao selecionar alguma opção do bloco de Estágio do Projeto
    $('input[name="estagio"]').on('change', function() {
        // Verifica se nenhuma opção foi selecionada
        if ($(this).val() === '') {
            // Se nenhuma opção foi selecionada, reseta os campos do 3º bloco do formulário
            $('.form-step-3').addClass('disabled').find('input, select, textarea').attr('disabled', true);
            
            // Desabilita o botão de submit
            $('input[type="submit"]').attr('disabled', false);
            return false;
        }

        // Se as opções dos 1º e 2º blocos foram selecionadas, os campos do 3º bloco são habilitados
        $('.form-step-3').removeClass('disabled').find('input, select, textarea').attr('disabled', false);

        // O botão de submit também é habilitado
        $('input[type="submit"]').attr('disabled', false);

    });

});

/* scrollspy */
$('body').scrollspy({ target: '#navbar-scroll' })

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});


/* parallax background image http://www.minimit.com/articles/lets-animate/parallax-backgrounds-with-centered-content	
/* detect touch */
if("ontouchstart" in window){
    document.documentElement.className = document.documentElement.className + " touch";
}
if(!$("html").hasClass("touch")){
    /* background fix */
    $(".parallax").css("background-attachment", "fixed");
}

/* fix vertical when not overflow
call fullscreenFix() if .fullscreen content changes */
function fullscreenFix(){
    var h = $('body').height();
    // set .fullscreen height
    $(".content-b").each(function(i){
        if($(this).innerHeight() <= h){
            $(this).closest(".fullscreen").addClass("not-overflow");
        }
    });
}
$(window).resize(fullscreenFix);
fullscreenFix();

/* resize background images */
function backgroundResize(){
    var windowH = $(window).height();
    $(".landing, .action, .contact, .subscribe").each(function(i){
        var path = $(this);
        // variables
        var contW = path.width();
        var contH = path.height();
        var imgW = path.attr("data-img-width");
        var imgH = path.attr("data-img-height");
        var ratio = imgW / imgH;
        // overflowing difference
        var diff = parseFloat(path.attr("data-diff"));
        diff = diff ? diff : 0;
        // remaining height to have fullscreen image only on parallax
        var remainingH = 0;
        if(path.hasClass("parallax") && !$("html").hasClass("touch")){
            var maxH = contH > windowH ? contH : windowH;
            remainingH = windowH - contH;
        }
        // set img values depending on cont
        imgH = contH + remainingH + diff;
        imgW = imgH * ratio;
        // fix when too large
        if(contW > imgW){
            imgW = contW;
            imgH = imgW / ratio;
        }
        //
        path.data("resized-imgW", imgW);
        path.data("resized-imgH", imgH);
        path.css("background-size", imgW + "px " + imgH + "px");
    });
}
$(window).resize(backgroundResize);
$(window).focus(backgroundResize);
backgroundResize();

/* set parallax background-position */
function parallaxPosition(e){
    var heightWindow = $(window).height();
    var topWindow = $(window).scrollTop();
    var bottomWindow = topWindow + heightWindow;
    var currentWindow = (topWindow + bottomWindow) / 2;
    $(".parallax").each(function(i){
        var path = $(this);
        var height = path.height();
        var top = path.offset().top;
        var bottom = top + height;
        // only when in range
        if(bottomWindow > top && topWindow < bottom){
            var imgW = path.data("resized-imgW");
            var imgH = path.data("resized-imgH");
            // min when image touch top of window
            var min = 0;
            // max when image touch bottom of window
            var max = - imgH + heightWindow;
            // overflow changes parallax
            var overflowH = height < heightWindow ? imgH - height : imgH - heightWindow; // fix height on overflow
            top = top - overflowH;
            bottom = bottom + overflowH;
            // value with linear interpolation
            var value = min + (max - min) * (currentWindow - top) / (bottom - top);
            // set background-position
            var orizontalPosition = path.attr("data-oriz-pos");
            orizontalPosition = orizontalPosition ? orizontalPosition : "50%";
            $(this).css("background-position", orizontalPosition + " " + value + "px");
        }
    });
}
if(!$("html").hasClass("touch")){
    $(window).resize(parallaxPosition);
    //$(window).focus(parallaxPosition);
    $(window).scroll(parallaxPosition);
    parallaxPosition();
}

    $('#myCarousel').carousel({
        pause: 'none'
    })

/*MASCARA DE TELEFONE*/
$("#telefone,#celular").bind('input propertychange', function () {
    var texto = $(this).val();
    texto = texto.replace(/[^\d]/g, '');

    if (texto.length > 0) {
        texto = "(" + texto;

        if (texto.length > 3) {
            texto = [texto.slice(0, 3), ") ", texto.slice(3)].join('');
        }
        if (texto.length > 12) {
            if (texto.length > 13)
                texto = [texto.slice(0, 10), "-", texto.slice(10)].join('');
            else
                texto = [texto.slice(0, 9), "-", texto.slice(9)].join('');
        }
        if (texto.length > 15)
            texto = texto.substr(0, 15);
    }
    $(this).val(texto);
});
/*FIM DA MASCARA*/