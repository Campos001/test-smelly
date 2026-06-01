const { UserService } = require('../src/userService');

describe('UserService - Suite de Testes Limpa', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  test('cria um usuario maior de idade com status ativo', () => {
    // Arrange
    const dadosUsuario = {
      nome: 'Fulano de Tal',
      email: 'fulano@teste.com',
      idade: 25,
    };

    // Act
    const usuarioCriado = userService.createUser(
      dadosUsuario.nome,
      dadosUsuario.email,
      dadosUsuario.idade
    );

    // Assert
    expect(usuarioCriado).toEqual(
      expect.objectContaining({
        nome: dadosUsuario.nome,
        email: dadosUsuario.email,
        idade: dadosUsuario.idade,
        isAdmin: false,
        status: 'ativo',
      })
    );
    expect(usuarioCriado.id).toEqual(expect.any(String));
    expect(usuarioCriado.createdAt).toEqual(expect.any(Date));
  });

  test('busca um usuario existente pelo id', () => {
    // Arrange
    const usuarioCriado = userService.createUser('Ana', 'ana@teste.com', 28);

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado).toEqual(usuarioCriado);
  });

  test('retorna null ao buscar um usuario inexistente', () => {
    // Arrange
    const idInexistente = 'id-inexistente';

    // Act
    const usuarioBuscado = userService.getUserById(idInexistente);

    // Assert
    expect(usuarioBuscado).toBeNull();
  });

  test('desativa um usuario comum', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('nao desativa um usuario administrador', () => {
    // Arrange
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, true);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);
    const usuarioAtualizado = userService.getUserById(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
    expect(usuarioAtualizado.status).toBe('ativo');
  });

  test('gera relatorio informando ausencia de usuarios cadastrados', () => {
    // Arrange

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum');
  });

  test('gera relatorio contendo usuarios cadastrados e seus status', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);
    const bob = userService.createUser('Bob', 'bob@email.com', 32);
    userService.deactivateUser(bob.id);

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
    expect(relatorio).toContain('ativo');
    expect(relatorio).toContain('inativo');
  });

  test('lanca erro ao criar usuario menor de idade', () => {
    // Arrange
    const criarUsuarioMenorDeIdade = () => {
      userService.createUser('Menor', 'menor@email.com', 17);
    };

    // Act & Assert
    expect(criarUsuarioMenorDeIdade).toThrow('maior de idade');
  });

  test('lanca erro ao criar usuario sem dados obrigatorios', () => {
    // Arrange
    const criarUsuarioSemNome = () => {
      userService.createUser('', 'semnome@email.com', 22);
    };

    // Act & Assert
    expect(criarUsuarioSemNome).toThrow('Nome, email e idade');
  });
});
