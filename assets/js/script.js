let limit = 2; //jumlah data yang ditampilkan pertama
let start = 0;
let action = "inactive";
let search = "";
let result = 0;

// fungsi ini digunakan untuk me routing halaman utama sehingga pada
// saat aplikasi pertama dijalankan , konten home akan langsung dibuka
$(document).ready(function () {
  home();
  $("#home").addClass("active");
  $("#katalog").removeClass("active");
  $("#profil").removeClass("active");
  $("#proses").removeClass("active");
});

//fungsi ini digunakan sebagai router halaman konten home
function home() {
  $.ajax({
    type: "GET",
    url: "home.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#home").addClass("active");
      $("#katalog").removeClass("active");
      $("#profil").removeClass("active");
      $("#proses").removeClass("active");

      $("#load_data").html("");
      start = 0;
      lazzy_loader(limit);
      if (action == "active") {
        action = "active";
        fetching_data(limit, start, search);
      }
    },
  });
}

//fungsi ini digunakan sebagai router halaman konten katalog

//fungsi ini digunakan sebagai router halaman konten profil
function profil() {
  $.ajax({
    type: "GET",
    url: "profil.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#home").removeClass("active");
      $("#katalog").removeClass("active");
      $("#profil").addClass("active");
      $("#proses").removeClass("active");
    },
  });
}
function proses() {
  $.ajax({
    type: "GET",
    url: "proses.html",
    data: "data",
    dataType: "html",
    success: function (response) {
      $("#content").html(response);
      $("#home").removeClass("active");
      $("#katalog").removeClass("active");
      $("#profil").removeClass("active");
      $("#proses").addClass("active");
    },
  });
}

//fungsi ini digunakan untuk mem format angka kedalam format curency
function numFormat(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fetching_data(limit, start, search) {
  $.ajax({
    url: "http://",
    method: "POST",
    data: {
      limit: limit,
      start: start,
      search: search,
    },
    dataType: "JSON",
    cache: false,
    success: function (response) {
      result = response.result;
      if (response.status) {
        let card_data = "";
        $.each(response.data, function (i, v) {
          card_data = ` <a class="product-items w-50 flex-column" href="javascript:void(0)" onclick="dialog('${v.id}');"> 
                    <div class="product-cover mb-2" style="background-image: url('${v.img}');"></div> 
                    <p class="bodytext1 semibold m-0 px-2 text-secondary">${v.nama}</p> <p class="bodytext2 color-black300 m-0 px-2">${v.deskripsi.substring(
            0,
            40
          )}</p> 
                        <p class="caption m-0 py-1 px-2 text-primary">Rp. ${numFormat(v.harga)}</p> 
                            </a>`;
          $("#load_data").append(card_data);
        });

        action = "inactive";
        $("#load_data_message").html("");
      } else {
        $("#load_data").html("");
        $("#load_data_message").html('<div class="col-12 text-center"><h4 class="text-danger">Oops, barang yang anda cari tidak di temukan</h4></div>');
        action = "active";
      }
    },
  });
}

function lazzy_loader(limit) {
  var output = "";
  for (var count = 0; count < limit; count++) {
    output += ` 
                    <a class="product-items w-50 flex-column shimmer" href="javascript:void(0)"> 
                    <div class="product-cover animate mb-2" ></div> 
                    <p class="bodytext1 semibold m-0 px-2 text-secondary animate mb-2"></p>
                    <p class="bodytext2 color-black300 m-0 px-2 animate mb-2"></p> 
                    <p class="caption m-0 py-1 px-2 text-primary animate"></p> 
                    </a>`;
  }

  $("#load_data_message").html(output);
}

$(window).scroll(function () {
  if ($(window).scrollTop() + $(window).height() > $("#load_data").height() && action == "inactive" && result == 1) {
    lazzy_loader(limit);
    action = "active";
    start = start + limit;
    setTimeout(function () {
      fetching_data(limit, start, search);
    }, 1000);
  }
});

function searchHandler() {
  $("#load_data").html("");
  search = $("#search").val();
  fetching_data(limit, start, search);
}
function callback(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const imgElement = entry.target.querySelector("img");
      const realSrc = imgElement.dataset.src;
      imgElement.setAttribute("src", realSrc);
      imgElement.style.filter = "blur(0px)";
    }
  });
}

const options = {
  threshold: 1.0,
};

let observer = new IntersectionObserver(callback, options);

observer.observe(target);
