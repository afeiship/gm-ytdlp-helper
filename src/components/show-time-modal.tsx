import { Button, Card, Image, Modal } from 'antd';
import { ModalProps } from 'antd';

export default (props: ModalProps) => {
  return <Modal {...props}>
    <div className="y-2">
      <Card title="Just some summary content" size="small" className="card read-the-docs p-2 bg-gray-200 rounded-md">
        <div className="x-2">
          <Image
            width={100}
            alt="basic"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
          <ul className="list-disc !pl-5">
            <li>道可道，非常道；名可名，非常名。</li>
            <li>无名，天地之始，有名，万物之母。</li>
            <li>故常无欲，以观其妙，常有欲，以观其徼。</li>
            <li>此两者，同出而异名，同谓之玄，玄之又玄，众妙之门。</li>
          </ul>
        </div>
      </Card>
      <footer className="x-2">
        <Button type="primary">Action1</Button>
        <Button>Action2</Button>
      </footer>
    </div>
  </Modal>;
}
