var thumbUp = document.getElementsByClassName("fa-thumbs-up");

//when i click on a trash can, i'm going to delete
var trash = document.getElementsByClassName("fa-trash");

//variable holding thumbDown icon
var thumbDown = document.getElementsByClassName("fa-thumbs-down");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText//
      console.log(this)
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {//making an api request to our own api by triggering
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({//sending json containing name and message by passing along a the name and message below
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(thumbDown).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText// parent(elemet wrapping the elemet) node coming from this
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        const thumbDown = parseFloat(this.parentNode.parentNode.childNodes[7].innerText)
        fetch('messages/downvote', {//making an api request to our own api by triggering
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({//sending json containing name and message by passing along a the name and message below
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp,
            'thumbDown':thumbDown
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'name': name,
            'msg': msg
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
