function showModal() {
    setTimeout(() => {
        $("#emailPopup").modal("show");
    }, 2000)
}

$(window).on("load", showModal)