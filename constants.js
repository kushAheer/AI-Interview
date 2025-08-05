export const LANGUAGES = {
    javascript: '1.32.3',
    python3: '3.10.0',
    java: '15.0.2',
    cpp: '10.2.0',
    csharp: '5.0.201',
}

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  cpp: `\n#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello, World in C++" << endl;\n\treturn 0;\n}\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
 
};