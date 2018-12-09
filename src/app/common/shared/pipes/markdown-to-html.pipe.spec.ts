import { MarkdownToHtmlPipe } from './markdown-to-html.pipe';

describe('MarkdownToHtmlPipe', () => {
  it('should transform headings', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform('# heading').trim()).toBe('<h1>heading</h1>');
  });

  it('should transform text', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform('text').trim()).toBe('<p>text</p>');
  });

  it('should transform multiple lines of text', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform('text\nmore text').trim()).toBe('<p>text<br>more text</p>');
  });

  it('should transform multiple paragraphs of text', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform('text\n\nmore text').trim()).toBe('<p>text</p>\n<p>more text</p>');
  });

  it('should transform inline code', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform('text `code` more text').trim()).toBe('<p>text <code>code</code> more text</p>');
  });

  it('should transform code blocks', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform('```\ncode\n```').trim()).toBe('<pre><code>code</code></pre>');
  });

  it('should highlight html code blocks', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform('```html\n<p>text</p>\n```').trim()).toBe(
      '<pre><code class="language-html"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">></span></span>text<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>p</span><span class="token punctuation">></span></span></code></pre>'
    );
  });

  it('should highlight typescript code blocks', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform("```typescript\nconst text = 'text';\n```").trim()).toBe(
      '<pre><code class="language-typescript"><span class="token keyword">const</span> text <span class="token operator">=</span> <span class="token string">\'text\'</span><span class="token punctuation">;</span></code></pre>'
    );
  });

  it('should transform links', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    expect(markdownToHtmlPipe.transform('[example](http://example.com)').trim()).toBe('<p><a href="http://example.com">example</a></p>');
  });

  it('should transform images', () => {
    const markdownToHtmlPipe = new MarkdownToHtmlPipe();

    const imageMarkdown = '[![description](https://example.com/image.jpg)](https://example.com/image.jpg)';
    const imageHtml = '<p><a href="https://example.com/image.jpg"><img src="https://example.com/image.jpg" alt="description"></a></p>';

    expect(markdownToHtmlPipe.transform(imageMarkdown).trim()).toBe(imageHtml);
  });
});
