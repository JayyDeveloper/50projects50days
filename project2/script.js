const circles = document.querySelectorAll('.circle');
const progress = document.getElementById('progress');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

currentlyActive = 1;

nextBtn.addEventListener('click',function(){
  currentlyActive++;

  if (currentlyActive > circles.length) {
    currentlyActive = circles.length;
  }
  update();
})

prevBtn.addEventListener('click',function(){
  currentlyActive--
  if(currentlyActive < 1) {
    currentlyActive = 1;
  }
  update();
})


function update(){

  circles.forEach((circle, idx) => {
    if(idx < currentlyActive) {
      circle.classList.add('active')
    } else {
      circle.classList.remove('active')
    }
  })
  let actives = document.querySelectorAll('.active');
  progress.style.width = ((actives.length - 1) / (circles.length - 1)) * 100 + "%";

  if (currentlyActive === 1) {
    prevBtn.disabled = true;
  } else if (currentlyActive === 4) {
    nextBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }
}
