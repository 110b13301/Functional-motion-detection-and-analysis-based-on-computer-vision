$(document).ready(function() {
    $('#contact-form').submit(function(e) {
      e.preventDefault(); // 阻止表單默認提交
  
      $.ajax({
        type: 'POST',
        url: 'register.php',
        data: $(this).serialize(), // 表單數據序列化
        success: function(response) {
          alert(response); // 顯示PHP回傳的訊息
          window.location.href = 'index.html'; 
        },
        error: function() {
          alert('註冊失敗，請再試一次。');
        }
      });
    });
  });
  