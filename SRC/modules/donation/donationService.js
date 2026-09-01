
const needs = [
    { id: 1, nome: "Cestas básicas", categoria: "Alimentos", quantidade: 24, doado: 8, prioridade: "urgente" },
    { id: 2, nome: "Material escolar", categoria: "Educação", quantidade: 60, doado: 22, prioridade: "atenção" },
    { id: 3, nome: "Roupas infantis", categoria: "Vestuário", quantidade: 35, doado: 35, prioridade: "normal" },
    { id: 4, nome: "Leite em pó", categoria: "Alimentos", quantidade: 18, doado: 4, prioridade: "urgente" },
    { id: 5, nome: "Produtos de higiene", categoria: "Higiene", quantidade: 40, doado: 12, prioridade: "normal" }
];


const get = (term = "", priority = "todas") => {
    const search = term.toLocaleLowerCase().trim();
    
    return needs.filter((item)=>{

        const matchesSearch =
              item.nome.toLocaleLowerCase().includes(search) || 
              item.categoria.toLocaleLowerCase().includes(search);
       
              const matchesPriority =
              priority === "todas" || item.prioridade === priority;
     


       return matchesSearch && matchesPriority;       
    });
  


    
}

export { get }