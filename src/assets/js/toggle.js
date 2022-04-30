const toggle = () => {
  document.documentElement.className =
    document.documentElement.className == 'light' ? 'dark' : 'light';

  const d = new Date();
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = "mode=" + document.documentElement.className + ";" + expires + ";path=/";
};

window.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById('darkmode').addEventListener('click', toggle);
});
