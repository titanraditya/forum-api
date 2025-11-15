const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
  constructor({ 
    threadRepository, 
  }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, credential) {
    const addThread = new AddThread(useCasePayload);
    const { id: idcredential } = credential;
    
    return this._threadRepository.addThread(addThread, idcredential);
  }
}

module.exports = AddThreadUseCase;