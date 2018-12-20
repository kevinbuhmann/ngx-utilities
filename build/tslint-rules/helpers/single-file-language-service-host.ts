import * as ts from 'typescript';

export class SingleSourceFileLanguageServiceHost implements ts.LanguageServiceHost {
  private readonly scriptSnapshot: ts.IScriptSnapshot;

  constructor(private readonly program: ts.Program, private readonly sourceFile: ts.SourceFile) {
    this.scriptSnapshot = ts.ScriptSnapshot.fromString(sourceFile.text);
  }

  getCompilationSettings() {
    return this.program.getCompilerOptions();
  }

  getCurrentDirectory() {
    return '';
  }

  getDefaultLibFileName(_options: ts.CompilerOptions) {
    return 'lib;';
  }

  getScriptFileNames() {
    return [this.sourceFile.fileName];
  }

  getScriptSnapshot(_fileName: string) {
    return this.scriptSnapshot;
  }

  getScriptVersion(_fileName: string) {
    return '1';
  }
}
