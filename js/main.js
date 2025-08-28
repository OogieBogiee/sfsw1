(function ($) {
    "use strict";

    new WOW().init();

    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) $('.navbar').addClass('sticky-top shadow-sm');
        else $('.navbar').removeClass('sticky-top shadow-sm');

        if ($(this).scrollTop() > 300) $('.back-to-top').fadeIn('slow');
        else $('.back-to-top').fadeOut('slow');

        const idioma = $('.idioma-simple');
        if ($(this).scrollTop() > 0) idioma.addClass('scroll-down');
        else idioma.removeClass('scroll-down');

        if ($(this).scrollTop() > 300) $('.chatgpt-btn').fadeIn('slow');
        else $('.chatgpt-btn').fadeOut('slow');
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 200, 'easeInOutExpo');
        return false;
    });

    document.addEventListener('DOMContentLoaded', function () {
        const menuLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');
        const sections = Array.from(menuLinks)
            .map(link => document.getElementById(link.getAttribute('href').slice(1)))
            .filter(sec => sec);

        function clearActive() {
            menuLinks.forEach(l => l.classList.remove('active'));
        }

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                clearActive();
                link.classList.add('active');
                if (link.classList.contains('dropdown-item')) 
                    link.closest('.dropdown-menu').previousElementSibling.classList.add('active');

                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                clearActive();
                menuLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                        if (link.classList.contains('dropdown-item')) 
                            link.closest('.dropdown-menu').previousElementSibling.classList.add('active');
                    }
                });
            });
        }, { root: null, rootMargin: '0px', threshold: 0.5 });

        sections.forEach(sec => observer.observe(sec));
    });
})(jQuery);

let scrollPos = 0;

document.querySelectorAll('.btn-show-bio').forEach(btn => {
    btn.addEventListener('click', () => {
        scrollPos = window.scrollY;
        const overlay = document.getElementById(btn.getAttribute('data-target'));
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
        document.querySelector('.navbar-light').classList.add('hidden');
        $(document.querySelector('.back-to-top')).fadeOut('fast');
        overlay.scrollTop = 0;
    });
});

document.querySelectorAll('.btn-close-bio').forEach(btn => {
    btn.addEventListener('click', () => {
        const overlay = btn.closest('.bio-overlay');
        overlay.style.transform = 'translateY(50px) scale(0.9)';
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.classList.remove('active');
            overlay.style.transform = '';
            overlay.style.opacity = '';
        }, 400);
        document.body.classList.remove('no-scroll');
        document.querySelector('.navbar-light').classList.remove('hidden');
        $(document.querySelector('.back-to-top')).fadeIn('fast');
        window.scrollTo(0, scrollPos);
    });
});

const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.multimedia-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cards.forEach(card => {
            if (filter === 'all' || card.dataset.type === filter) card.classList.remove('hidden');
            else card.classList.add('hidden');
        });
    });
});

document.querySelectorAll('.btn-share').forEach(btn => {
    btn.addEventListener('click', function(e){
        e.stopPropagation();
        const container = this.closest('.binomio-img');
        container.classList.toggle('active');
    });
});

document.addEventListener('click', function(e){
    document.querySelectorAll('.binomio-img.active').forEach(el => {
        if(!el.contains(e.target)){
            el.classList.remove('active');
        }
    });
});

const EVENTS = [
  { id:"e1", title:"Jornada de Capacitación", start:"2025-08-30T09:00:00", end:"2025-08-30T13:00:00", location:"CADECO", short:"Formación presencial con material y certificado.", description:"Capacitación completa con simulacros. Traer carnet de identidad y cuaderno.", register:"https://forms.gle/FORM1" },
  { id:"e2", title:"Webinar Delegado de Mesa", start:"2025-09-12T18:00:00", end:"2025-09-12T19:30:00", location:"Zoom", short:"Sesión online con preguntas y respuestas.", description:"Sesión en vivo con material descargable y evaluación.", register:"https://forms.gle/FORM2" },
  { id:"e3", title:"Feria Informativa", start:"2025-10-03T10:00:00", end:"2025-10-03T14:00:00", location:"Plaza Central - El Alto", short:"Stand informativo y convocatoria a voluntarios.", description:"Buscamos voluntarios para logística y difusión.", register:"https://forms.gle/FORM3" }
];

const monthNames = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const wrap = document.getElementById("events-wrap");
const filter = document.getElementById("filter-month");
const toggleBtn = document.getElementById("toggle-view");

function formatDate(iso, type="short"){
  return new Date(iso).toLocaleString("es-BO", type==="short"
    ? { dateStyle:"medium", timeStyle:"short" }
    : { dateStyle:"full", timeStyle:"short" });
}
function dateParts(iso){
  const d=new Date(iso); 
  return { day:d.getDate().toString().padStart(2,"0"), month:monthNames[d.getMonth()] };
}

function renderEvents(view="grid", month="all"){
  wrap.innerHTML="";
  const now = Date.now();
  const list = EVENTS.filter(e=> new Date(e.end)>=now).sort((a,b)=>new Date(a.start)-new Date(b.start));
  const filtered = month==="all"? list : list.filter(e=>new Date(e.start).getMonth()===+month);
  if(!filtered.length){ wrap.innerHTML=`<p class="text-muted">No hay eventos.</p>`; return; }

  filtered.forEach(ev=>{
    const date=dateParts(ev.start);
    let html=`
      <div class="${view==="grid"?"col-md-6 col-lg-4": "col-12"}">
        <div class="bg-white rounded-3 shadow-sm p-3 d-flex gap-3 h-100">
          <div class="text-center bg-light rounded-3 p-2" style="min-width:72px">
            <div class="fw-bold fs-4">${date.day}</div>
            <div class="text-muted small text-uppercase">${date.month}</div>
          </div>
          <div class="flex-grow-1 d-flex flex-column">
            <h5 class="mb-1">${ev.title}</h5>
            <p class="text-muted small mb-1">${formatDate(ev.start)} · ${ev.location}</p>
            <p class="mb-2">${ev.short}</p>
            <div class="mt-auto d-flex gap-2 flex-wrap">
              <button class="btn btn-outline-danger btn-sm" data-id="${ev.id}" data-bs-toggle="modal" data-bs-target="#eventModal">Más info</button>
              <a class="btn btn-secondary btn-sm" href="${ev.register}" target="_blank">Inscribirme</a>
            </div>
          </div>
        </div>
      </div>`;
    wrap.insertAdjacentHTML("beforeend",html);
  });
}

[...new Set(EVENTS.map(e=>new Date(e.start).getMonth()))]
  .sort((a,b)=>a-b)
  .forEach(m=>{
    filter.insertAdjacentHTML("beforeend",`<option value="${m}">${monthNames[m]}</option>`);
  });

const modalTitle=document.getElementById("eventModalLabel");
const modalSub=document.getElementById("eventModalSub");
const modalBody=document.getElementById("eventModalBody");
const regBtn=document.getElementById("eventRegister");
const gcal=document.getElementById("addGcal");
const ics=document.getElementById("downloadIcs");

document.addEventListener("click",e=>{
  if(e.target.dataset.id){
    const ev=EVENTS.find(x=>x.id===e.target.dataset.id);
    modalTitle.textContent=ev.title;
    modalSub.textContent=`${formatDate(ev.start)} · ${ev.location}`;
    modalBody.innerHTML=`<p>${ev.description}</p>`;
    regBtn.href=ev.register;
    document.querySelector('.navbar-light').classList.add('hidden');
    gcal.onclick=()=>window.open(`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(ev.title)}&dates=${new Date(ev.start).toISOString().replace(/[-:]/g,"").split(".")[0]+"Z"}/${new Date(ev.end).toISOString().replace(/[-:]/g,"").split(".")[0]+"Z"}&location=${encodeURIComponent(ev.location)}&details=${encodeURIComponent(ev.description)}`,"_blank");
    ics.onclick=()=>{
      const content=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${ev.title}\nDTSTART:${new Date(ev.start).toISOString().replace(/[-:]/g,"").split(".")[0]+"Z"}\nDTEND:${new Date(ev.end).toISOString().replace(/[-:]/g,"").split(".")[0]+"Z"}\nDESCRIPTION:${ev.description}\nLOCATION:${ev.location}\nEND:VEVENT\nEND:VCALENDAR`;
      const blob=new Blob([content],{type:"text/calendar"});
      const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=ev.id+".ics";a.click();
    };
  }
});
document.getElementById("eventModal").addEventListener("hidden.bs.modal",()=>{
  document.querySelector('.navbar-light').classList.remove('hidden');
});
toggleBtn.onclick=()=>{
  toggleBtn.dataset.view=toggleBtn.dataset.view==="grid"?"list":"grid";
  toggleBtn.textContent="Vista: "+(toggleBtn.dataset.view==="grid"?"Tarjetas":"Lista");
  renderEvents(toggleBtn.dataset.view,filter.value);
};
filter.onchange=()=>renderEvents(toggleBtn.dataset.view,filter.value);

renderEvents();
