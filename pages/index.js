import { useState, useEffect } from 'react'
import { Formik, Form, Field } from 'formik'
import Link from 'next/link'
import Head from 'next/head'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
} from '@chakra-ui/react'
import style from '../styles/index.module.scss'

const testHref = url => /^https?:\/\//.test(url) 
const getRandomColor = function () {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
}
const onKeyDown = (e) => {
  if (e.key === 'Enter') {
    const value = e.target.value
    if(testHref(value)) {
      window.location.href = value
    } else {
      window.location.href = `https://google.com/search?q=${value}`
    }
  }
}
function setItems(value) {
  if(window) {
    localStorage.setItem('my_list', JSON.stringify({ v: value }))
  }
}
function getItems() {
  if(window) {
    return JSON.parse(window.localStorage.getItem('my_list'))?.v || []
  }
}

export default function Home() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [list, setList] = useState([])
  useEffect(() => {
    setList(getItems())
  }, [])
  return (
    <>
      <Head>
        <title>Google search</title>
        {/* <meta name="viewport" content="width=device-width" /> */}
        <link rel='icon' href='/next-guide/favicon.ico' />
      </Head>
      <main className={style.main}>
        <div className={style.wrapper}>
          <div className={style.logo}></div>
          <input
            className={style.mainInput}
            type='text'
            placeholder="在 Google 上搜索，或者输入一个网址"
            onKeyDown={onKeyDown}
          />

          <div className={style.listWrapper}>
            {list.map((item, index) => {
              // console.log('%c list: ', 'font-size:12px;background-color: #ED9EC7;color:#fff;', list)
              // const url = new URL(item.href)
              return (
                <div className={style.linkWrapper} key={index}>
                  <Link href={item.href}>
                    <a>
                      <button className={style.hrefBtn}>
                        <div className={style.imageWrapper}>
                          <Image
                            src={`${item.href}/favicon.ico`}
                            alt=''
                            fallback={
                              <div className={style.fallback} style={{ backgroundColor: item.color }}>
                                {item.title.substring(0, 1)}
                              </div>
                            }
                          />
                        </div>
                        <p className={style.btnName}>{item.title}</p>
                      </button>
                    </a>
                  </Link>
                  <div className={style.delete} onClick={() => {
                    setList(list => {
                      const newList = list.slice()
                      newList.splice(index, 1)
                      setItems(newList)
                      return newList
                    })
                  }}>×</div>
                </div>
              )
            })}
            <button className={style.addBtn} onClick={onOpen}>
              <div className={style.btn}>+</div>
              <p className={style.btnName}>添加快捷方式</p>
            </button>
          </div>

          <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <Formik
                initialValues={{ title: '', href: '' }}
                validate={(values) => {
                  const errors = {}
                  if (!values.title) {
                    errors.title = '需要一个名称'
                  } else if (!values.href) {
                    errors.href = '需要一个地址'
                  }
                  return errors
                }}
                onSubmit={(values, props) => {
                  const isValidHref = testHref(values.href)
                  const v = Object.assign(
                    {
                      color: getRandomColor(),
                    },
                    values,
                    isValidHref ? {} : {
                      href: `http://${values.href}`
                    }
                  )
                  const newList = list.concat(v)
                  setList(newList)
                  setItems(newList)
                  onClose()
                }}
              >
                {(props) => (
                  <Form>
                    <ModalHeader>添加快捷方式</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <Field name='title'>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.title && form.touched.title}
                            isRequired
                          >
                            <FormLabel htmlFor='title'>名称</FormLabel>
                            <Input
                              autoFocus
                              {...field}
                              id='title'
                              placeholder='请输入名称'
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name='href'>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.href && form.touched.href}
                            isRequired
                          >
                            <FormLabel mt='20px' htmlFor='href'>
                              网址
                            </FormLabel>
                            <Input
                              {...field}
                              id='href'
                              placeholder='请输入网址'
                            />
                          </FormControl>
                        )}
                      </Field>
                    </ModalBody>

                    <ModalFooter>
                      <Button variant='ghost' mr={3} onClick={onClose}>
                        取消
                      </Button>
                      <Button
                        disabled={!props.values.title || !props.values.href}
                        colorScheme='blue'
                        type='submit'
                        onClick={() => console.log(props)}
                      >
                        完成
                      </Button>
                    </ModalFooter>
                  </Form>
                )}
              </Formik>
            </ModalContent>
          </Modal>
        </div>
      </main>
    </>
  )
}
