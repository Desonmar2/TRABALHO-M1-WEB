const appendItems = (items) => {
   const content = document.querySelector('#donations-content');

   const children = items.map((item) => ` 
   <div class="col-md-6 col-xl-4">
        <article class="need-card">
          <div class="d-flex justify-content-between gap-2">
            <span class="badge-soft ${item.prioridade === "urgente" ? "red" : item.prioridade === "atenção" ? "yellow" : "green"}">${item.prioridade}</span>
            <small>${item.categoria}</small>
          </div>
          <h3>${item.nome}</h3>
          <p>Doadas: <strong>${item.doado}</strong> de ${item.quantidade} unidades.</p>
          <p>Faltam <strong>${item.quantidade - item.doado}</strong> unidades.</p>
          <button class="btn btn-sm btn-outline-primary find-button" data-id="${item.id}">Ver necessidade</button>
        </article>
      </div>
      `).join('');

   content.innerHTML = children;

}

export {appendItems};
