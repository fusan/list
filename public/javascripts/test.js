window.addEventListener('load', control, false);
      
      function control() {
        var control = document.getElementById('control');
        var panel = document.getElementById('controlPanel');
        var count = document.getElementById('count');

        control.setAttribute('src','/images/control.svg');
        control.style.position = 'absolute';
        control.style.top = count.top - count.height * .5;
        control.style.left = '90%';

        panel.style.position = 'absolute';
        panel.style.top = '100px';
        panel.style.left = '70%';
        panel.style.display = 'block';

        control.addEventListener('click', panelshow, false);
        control.addEventListener('mouseenter', mouseenter, false);
        control.addEventListener('mouseleave', mouseleave, false);

        function panelshow() {
          if(panel.style.display == 'block') {
            panel.style.display == 'none';
          } else {
            panel.style.display == 'block';} 
          }

        function mouseenter() {
          control.style.opacity = .8;
        }

        function mouseleave() {
          control.style.opacity = 1;
        }

      }