// Exemplo de lógica para testar a função de progresso
const calculateProgress = (tasks) => {
    const done = tasks.filter(t => t.completed).length;
    return tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
};

test('Deve calcular 50% de progresso quando metade das tarefas estiver concluída', () => {
    const mockTasks = [
        { completed: true },
        { completed: false }
    ];
    expect(calculateProgress(mockTasks)).toBe(50);
});

test('Deve retornar 0% quando não houver tarefas', () => {
    expect(calculateProgress([])).toBe(0);
});

test('Deve retornar 100% quando todas as tarefas estiverem concluídas', () => {
    expect(calculateProgress([{ completed: true }])).toBe(100);
});