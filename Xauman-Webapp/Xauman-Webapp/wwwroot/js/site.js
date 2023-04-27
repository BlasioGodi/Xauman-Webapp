"use strict";
/* Page Loader */
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader");
    loader.classList.add("loader-hidden");

    loader.addEventListener("transitionend", () => {
        document.body.removeChild("loader");
    })
});

/* Button Submit */
console.log("XAU init");
const XAU_EL = {
    submit: document.getElementById("sub_button"),
    email: document.getElementById("email"),
    loading: document.getElementById("btn-loading")
};

let canSubmit = false;

function xau_can_submit() {
    let email = XAU_EL.email.value.trim();
    if (email.length > 4) {
        xau_enable_submit()
    } else {
        xau_disable_submit()
    }
}

function xau_enable_submit() {
    XAU_EL.submit.classList.add("submit_enabled");
    XAU_EL.submit.disabled = false;
    canSubmit = true;
}

function xau_disable_submit() {
    XAU_EL.submit.classList.remove("submit_enabled");
    XAU_EL.submit.disabled = true;
    canSubmit = false;
}

function xau_set_event_listeners() {
    XAU_EL.email.addEventListener("keyup", xau_can_submit);
}

// Footer Collapse Button
const closeBtn = document.querySelector('.btn-close');
let clickCount = 0;

closeBtn.addEventListener('click', () => {
    clickCount++;

    if (clickCount === 2) {
        closeBtn.blur();
        clickCount = 0;
    }
});

//Add event listeners
xau_set_event_listeners();

var Xauman = {
    init: function () {
        this.Component.init();
    },
    Component: {
        init: function () {
            this.forms();
        },
        forms: function () {

            /* Validate Form */
            $('.js-ajax-form').each(function () {
                $(this).validate({
                    validClass: 'valid',
                    errorClass: 'error',
                    errorClass: 'error wobble-error',
                    onfocusout: function (element, event) {
                        $(element).valid();
                    },
                    errorPlacement: function (error, element) {
                        return true;
                    },
                    rules: {
                        email: {
                            required: true,
                            email: true
                        }
                    }
                });
            });

            // Contact Form
            var $contactForm = $('#contact-form');

            if ($contactForm.length > 0) {
                $contactForm.submit(function () {
                    var $btn = $(this).find('.btn-loading');
                    var $form = $(this);
                    var response;
                    const subButton = document.getElementById("sub_button");
                    if ($form.valid()) {
                        $('.btn-loading').show();
                        $('.btn-submit').hide();
                        //  XMLHttpRequest to get output from .php file and print on the console.
                        //Start
                        var xhttp = new XMLHttpRequest();
                        var dateTiming;
                        xhttp.onreadystatechange = function () {
                            if (this.readyState == 4 && this.status == 200) {
                                dateTiming = this.responseText;
                            }
                        };
                        xhttp.open("GET", "mail.php", true);
                        xhttp.send();
                        //End
                        $.ajax({
                            type: 'POST',
                            url: 'mail.php',
                            data: $form.serialize(),
                            error: function (err) {
                                setTimeout(function () {
                                    $('.col-message, .error-message').show();
                                    $('.btn-loading').hide();
                                    $('.btn-submit').show();
                                    xau_disable_submit();
                                }, 2000);
                            },
                            success: function (responseText) {
                                var funcResponse = responseText.trim();
                                var match = funcResponse.match(/success/i);
                                if (match !== null) {
                                    response = 'success';
                                } else {
                                    response = 'error';
                                }
                                setTimeout(function () {
                                    $btn.addClass(response);
                                    $('.col-message, .success-message').show();
                                    xau_disable_submit();
                                    $('.btn-loading').hide();
                                    $('.btn-submit').show();

                                }, 800);
                                console.log("Response: ", response);
                            },
                            complete: function (data) {
                                setTimeout(function () {
                                    $('.btn-loading').hide();
                                    $('.btn-submit').show();
                                    xau_disable_submit();
                                }, 4000);
                            }
                        });
                        return false;
                    }
                    return false;
                });
            }
        }
    }
};

$(document).ready(function () {
    Xauman.init();
});