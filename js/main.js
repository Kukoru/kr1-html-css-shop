// ===================================
// Модальное окно заявки
// ===================================
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

if (orderDialog && orderButtons.length) {
  // Открытие модалки по кнопке «Заказать»
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product || 'Не указан';
      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }
      orderDialog.showModal();
    });
  });

  // Закрытие модалки
  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', () => {
      orderDialog.close();
    });
  }

  // Закрытие по клику вне окна
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });
}

// ===================================
// Обработка формы в модалке
// ===================================
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Сброс старых ошибок
    const formElements = Array.from(orderForm.elements);
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Проверка валидности
    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      orderForm.reportValidity();
      return;
    }

    // Успешная отправка
    // Сохраняем заявку в localStorage
    const orderData = {
      name: orderForm.elements.name?.value || '',
      email: orderForm.elements.email?.value || '',
      product: selectedProductInput?.value || '',
      date: new Date().toISOString(),
    };
    try {
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
    } catch (e) {
      console.warn('localStorage недоступен', e);
    }

    if (successMessage) {
      successMessage.hidden = false;
    }
    orderForm.reset();
    if (orderDialog) {
      orderDialog.close();
    }
  });
}

// ===================================
// Обработка формы на странице order.html
// ===================================
const pageOrderForm = document.getElementById('order-form-page');
const pageSuccessMessage = document.getElementById('success-message-page');

if (pageOrderForm) {
  pageOrderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = Array.from(pageOrderForm.elements);
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (!pageOrderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });
      pageOrderForm.reportValidity();
      return;
    }

    if (pageSuccessMessage) {
      pageSuccessMessage.hidden = false;
    }
    pageOrderForm.reset();
  });
}

// ===================================
// Фильтр каталога
// ===================================
const filtersForm = document.getElementById('filters-form');

if (filtersForm) {
  const cards = document.querySelectorAll('.catalog-products .product-card');
  const priceFrom = document.getElementById('price-from');
  const priceTo = document.getElementById('price-to');

  const applyFilters = () => {
    // Собираем отмеченные категории
    const checkedCategories = Array.from(
      filtersForm.querySelectorAll('input[name="category"]:checked')
    ).map((cb) => cb.value);

    // Считываем диапазон цены
    const minPrice = priceFrom && priceFrom.value ? Number(priceFrom.value) : 0;
    const maxPrice = priceTo && priceTo.value ? Number(priceTo.value) : Infinity;

    // Показываем/прячем карточки
    cards.forEach((card) => {
      const category = card.dataset.category;
      const price = Number(card.dataset.price);

      const categoryMatch =
        checkedCategories.length === 0 || checkedCategories.includes(category);
      const priceMatch = price >= minPrice && price <= maxPrice;

      card.style.display = categoryMatch && priceMatch ? '' : 'none';
    });
  };

  // Фильтрация при изменении чекбоксов
  filtersForm.addEventListener('change', applyFilters);

  // Фильтрация при нажатии «Применить»
  filtersForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });
}

// ===================================
// Приветствие при повторном визите
// ===================================
const welcomeBanner = document.getElementById('welcome-banner');
const welcomeText = document.getElementById('welcome-text');
const welcomeClose = document.getElementById('welcome-close');

if (welcomeBanner && welcomeText) {
  try {
    const saved = localStorage.getItem('lastOrder');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.name) {
        welcomeText.textContent = `${data.name}, рады видеть вас снова! Хотите оставить новую заявку?`;
        welcomeBanner.hidden = false;
      }
    }
  } catch (e) {
    console.warn('Не удалось прочитать lastOrder', e);
  }

  if (welcomeClose) {
    welcomeClose.addEventListener('click', () => {
      welcomeBanner.hidden = true;
    });
  }
}