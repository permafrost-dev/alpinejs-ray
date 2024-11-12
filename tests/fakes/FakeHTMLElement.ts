export class FakeHTMLElement {
    attributes: Record<string, string> = {};
    id: string = '';
    tagName: string = 'div';
    parentElement: FakeHTMLElement | null = null;

    constructor(attributes: Record<string, string> = {}, id: string = '', tagName: string = 'div') {
        this.attributes = attributes;
        this.id = id;
        this.tagName = tagName;
    }

    getAttribute(name: string): string | null {
        return this.attributes[name] || null;
    }

    closest(selector: string): FakeHTMLElement | null {
        return this.parentElement;
    }

    hasAttribute(name: string): boolean {
        return name in this.attributes;
    }
}

// generate a series of fake elements for testing, by setting the parentElement property:
export function generateFakeElements(): FakeHTMLElement {
    const parent = new FakeHTMLElement({ 'x-data': 'parentData' });
    const child = new FakeHTMLElement({ 'x-data': 'childData' });
    const grandChild = new FakeHTMLElement({ 'x-data': 'grandChildData' });

    grandChild.parentElement = child;
    child.parentElement = parent;

    return grandChild;
}
