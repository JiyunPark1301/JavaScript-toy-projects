const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const openModalBtn = $('.add-note-btn');
const modalOverlay = $('.modal-overlay');
const closeModalBtn = $('.modal-close');
const modal = $('.modal');
const titleInput = $('.note-title-input');
const contentInput = $('.note-content-input');
const addNoteBtn = $('.modal-add');
const modalPinBtn = $('.modal-footer-left .pin');
const modalColorBtn = $('.modal-footer-left .color-select');
const modalDeleteBtn = $('.modal-footer-left .delete');
const noteLists = $$('.note-container');
const wrapper = $('.wrapper');
const zeroPinnedMessage = $('.zeroPinnedMessage');
const zeroNoteMessage = $('.zeroNoteMessage');

let bgColor = '#fff';
let isPinned = false;
let isEditMode = false;
let picked = null;
let pickedIndex = null;
let notes;

// 모달창 열기
const openModal = (id) => {
  // 수정모드라면 삭제버튼이 존재, 버튼의 text가 수정
  if (isEditMode) {
    modalDeleteBtn.classList.remove('hidden');
    addNoteBtn.textContent = '수정';

    // ? 모달창을 통해서 수정이나 삭제를 하는 경우를 대비
    addNoteBtn.dataset.id = id;
    modalDeleteBtn.dataset.id = id;
    // modalPinBtn.dataset.id = id;

    const index = notes.findIndex((note) => note.id === id);
    titleInput.value = notes[index].title;
    contentInput.value = notes[index].content;
    bgColor = notes[index].bgColor;
    modalColorBtn.style.backgroundColor = bgColor;
    if (notes[index].pinned) modalPinBtn.classList.add('black');
    else modalPinBtn.classList.remove('black');
  } else {
    // 추가모드라면 삭제버튼이 존재X, 버튼의 text가 추가
    modalDeleteBtn.classList.add('hidden');
    addNoteBtn.textContent = '추가';
  }
  modalOverlay.classList.remove('hidden');
};

const makeIsPinnedFalse = () => {
  isPinned = false;
  modalPinBtn.classList.remove('black');
};

const makeIsPinnedTrue = () => {
  isPinned = true;
  modalPinBtn.classList.add('black');
};

// 모달창 닫기
const closeModal = () => {
  // modalPinBtn.removeAttribute('data-id');
  modalOverlay.classList.add('hidden');
  titleInput.value = '';
  contentInput.value = '';
  makeIsPinnedFalse();
  bgColor = '#fff';
  modalColorBtn.style.backgroundColor = bgColor;
};

const addNote = () => {
  if (titleInput.value.trim() === '' || contentInput.value.trim() === '')
    return alert('제목이나 내용을 적어주세요');

  const note = {
    id: Date.now().toString(),
    title: titleInput.value,
    content: contentInput.value,
    pinned: isPinned,
    bgColor,
  };

  notes.push(note);
  checkNumOfLists();
  localStorage.setItem('notes', JSON.stringify(notes));

  renderNote(note);
  closeModal();
};

const renderEditedNote = (id, title, content) => {
  const note = $(`article[data-id='${id}']`);
  note.querySelector('.note-title').innerText = title;
  note.querySelector('.note-content').innerText = content;
};

const renderPinnedNote = (id, index) => {
  const pinBtn = $(`article[data-id='${id}'] .pin`);
  const li = pinBtn.closest('.note-item');
  li.remove();
  if (notes[index].pinned) {
    noteLists[0].append(li);
    pinBtn.classList.add('black');
  } else {
    noteLists[1].append(li);
    pinBtn.classList.remove('black');
  }
};

const renderColoredNote = (id) => {
  const div = $(`article[data-id='${id}'] .note-top`);
  div.style.backgroundColor = bgColor;
};

const editNote = (e) => {
  if (titleInput.value.trim() === '' || contentInput.value.trim() === '')
    return alert('제목이나 내용을 적어주세요');
  const id = e.target.dataset.id;
  e.target.removeAttribute('data-id');
  const index = notes.findIndex((note) => note.id === id);
  notes[index].title = titleInput.value;
  notes[index].content = contentInput.value;
  notes[index].bgColor = bgColor;

  if (modalPinBtn.classList.contains('black') && !notes[index].pinned) {
    notes[index].pinned = true;
    renderPinnedNote(id, index);
  }
  if (!modalPinBtn.classList.contains('black') && notes[index].pinned) {
    notes[index].pinned = false;
    renderPinnedNote(id, index);
  }

  renderEditedNote(id, titleInput.value, contentInput.value);
  renderColoredNote(id);
  notes = changeOrderOfNotes(notes);
  localStorage.setItem('notes', JSON.stringify(notes));
  checkNumOfLists();

  closeModal();
};

const deleteNote = (e, id) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;
  // 모달창을 통해 삭제하는 경우
  if (!id) {
    id = modalDeleteBtn.dataset.id;
    modalDeleteBtn.removeAttribute('data-id');
  }
  /////////////////////
  const index = notes.findIndex((note) => note.id === id);
  notes.splice(index, 1);
  checkNumOfLists();
  localStorage.setItem('notes', JSON.stringify(notes));
  let li = e.target.closest('.note-item');
  // 모달창을 통해 삭제하는 경우
  if (!li) {
    li = $(`article[data-id='${id}']`).closest('.note-item');

    closeModal();
  }
  /////////////////////
  li.remove();
};

const checkNumOfLists = () => {
  if (notes.filter((note) => note.pinned).length === 0) {
    zeroPinnedMessage.classList.remove('hidden');
  } else {
    zeroPinnedMessage.classList.add('hidden');
  }
  if (notes.filter((note) => !note.pinned).length === 0) {
    zeroNoteMessage.classList.remove('hidden');
  } else {
    zeroNoteMessage.classList.add('hidden');
  }
};

const changeOrderOfNotes = () => {
  const pinnedList = [...noteLists[0].children].map(
    (li) => li.firstElementChild.dataset.id
  );
  const notPinnedList = [...noteLists[1].children].map(
    (li) => li.firstElementChild.dataset.id
  );
  const idList = [...pinnedList, ...notPinnedList];
  return idList.map((id) => notes.find((note) => note.id === id));
};

const pinNote = (pinBtn, id) => {
  const index = notes.findIndex((note) => note.id === id);
  notes[index].pinned = notes[index].pinned ? false : true;

  const li = pinBtn.closest('.note-item');
  li.remove();
  if (notes[index].pinned) {
    noteLists[0].append(li);
    pinBtn.classList.add('black');
  } else {
    noteLists[1].append(li);
    pinBtn.classList.remove('black');
  }
  notes = changeOrderOfNotes();
  localStorage.setItem('notes', JSON.stringify(notes));
  checkNumOfLists();
};

const pinNoteByModal = (type) => {
  if (type === 'new') {
    isPinned ? makeIsPinnedFalse() : makeIsPinnedTrue();
    return;
  }
  modalPinBtn.classList.toggle('black');
};

const changeBgColor = (note, bgBtn, id) => {
  const index = notes.findIndex((note) => note.id === id);
  const color = bgBtn.firstElementChild.value;

  notes[index].bgColor = color;
  localStorage.setItem('notes', JSON.stringify(notes));
  note.querySelector('.note-top').style.backgroundColor = color;
};

const renderNote = (note) => {
  const { id, title, content, pinned, bgColor } = note;
  const li = document.createElement('li');
  li.className = 'note-item';
  li.setAttribute('draggable', true);
  const article = document.createElement('article');
  article.className = 'note';
  article.dataset.id = id;
  const div = document.createElement('div');
  div.className = 'note-top';
  const h3 = document.createElement('h3');
  h3.className = 'note-title ellipsis';
  h3.innerText = title;
  const p = document.createElement('p');
  p.className = 'note-content multi-ellipsis';
  p.innerText = content;
  const footer = document.createElement('footer');
  footer.className = 'note-footer';
  footer.innerHTML = `
    <button class="pin ${pinned ? 'black' : ''}" type="button">
      <i class="fa-solid fa-thumbtack"></i>
    </button>
    <button class="color-select" type="button">
      <input class="color-picker" type="color" />
      <i class="fa-solid fa-palette"></i>
    </button>
    <button class="delete" type="button">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;
  div.append(h3, p);
  article.append(div, footer);
  li.append(article);
  pinned ? noteLists[0].append(li) : noteLists[1].append(li);
  div.style.backgroundColor = bgColor;
};

openModalBtn.addEventListener('click', () => {
  isEditMode = false;
  openModal();
});
modalOverlay.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  e.stopPropagation();
});

addNoteBtn.addEventListener('click', (e) => {
  if (isEditMode) {
    editNote(e);
    return;
  }
  addNote();
});

noteLists.forEach((noteList) => {
  noteList.addEventListener('click', (e) => {
    const note = e.target.closest('.note');
    if (!note) return;
    const id = note.dataset.id;
    if (e.target.closest('.delete')) return deleteNote(e, id);
    const pinBtn = e.target.closest('.pin');
    if (pinBtn) return pinNote(pinBtn, id);
    if (e.target.closest('.color-select')) return;
    isEditMode = true;
    openModal(id);
  });

  noteList.addEventListener('input', (e) => {
    const bgBtn = e.target.closest('.color-select');
    if (bgBtn) {
      const note = e.target.closest('.note');
      const id = note.dataset.id;
      changeBgColor(note, bgBtn, id);
      return;
    }
  });

  noteList.addEventListener('dragstart', (e) => {
    const li = e.target.closest('.note-item');
    if (!li) return;
    picked = li;
    pickedIndex = [...noteList.children].indexOf(li);
  });
  noteList.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  noteList.addEventListener('drop', (e) => {
    const li = e.target.closest('li');
    if (!li) return;
    const index = [...noteList.children].indexOf(li);
    if (index > pickedIndex) {
      li.after(picked);
    } else {
      li.before(picked);
    }
  });
});

modalPinBtn.addEventListener('click', () => {
  isEditMode ? pinNoteByModal() : pinNoteByModal('new');
});
modalDeleteBtn.addEventListener('click', deleteNote);
modalColorBtn.addEventListener('input', () => {
  bgColor = modalColorBtn.firstElementChild.value;
  modalColorBtn.style.backgroundColor = bgColor;
});

const renderAllNotes = () => {
  checkNumOfLists();
  notes.forEach((note) => renderNote(note));
};

const init = () => {
  notes = JSON.parse(localStorage.getItem('notes'));
  notes = notes ?? [];

  renderAllNotes();
};

init();
