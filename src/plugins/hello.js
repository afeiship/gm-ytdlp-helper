/**
 * @description
 * Hello for tampermonkey plugin.
 */
class App {
  async run() {
    console.log('hello tampermonkey!');
  }
}

$(document).ready(() => {
  const url = document.URL;
  if (!url.includes('dianping.com')) return;
  console.log('otherwise, it works!');
});
