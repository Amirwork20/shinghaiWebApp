'use client'

import { useState } from 'react'
import { Footer } from '../components/layout/Footer'
import { Header } from '../components/layout/Header'

interface FAQItem {
  question: string
  answer?: string
  isOpen?: boolean
}

interface FAQSection {
  title: string
  items: FAQItem[]
}

export default function FAQs() {
  const [sections, setSections] = useState<FAQSection[]>([
    {
      title: "MY ACCOUNT",
      items: [
        {
          question: "Do I need to have an account to shop with you?",
          answer: "You can shop from our online store without creating an account and can place an order with guest checkout. However, creating an account will make your shopping process easier."
        },
        { question: "How do I create an account?" },
        { question: "How can I change my shipping address?" },
        { question: "What if I forget my password?" }
      ]
    },
    {
      title: "ORDER",
      items: [
        { question: "How do I place an order?" },
        { question: "How long will my order take to arrive?" },
        { question: "Can I cancel my order?" },
        { question: "Do you take orders over phone call or WhatsApp?" },
        { question: "What does it mean if I don't receive a sales invoice via email/SMS after I check-out?" },
        { question: "How will I know the status of my order?" },
        { question: "What is the difference between order ID and tracking ID?" },
        { question: "How many times does the courier service agent attempt to deliver my order?" },
        { question: "Can I add more items to my existing order?" },
        { question: "Does adding an item to the cart means that the item is reserved?" },
        { question: "What is the difference between 'add to wishlist' and 'add to cart'?" }
      ]
    },
    {
      title: "PAYMENT",
      items: [
        { question: "What payment options are available?" },
        { question: "What happens if my payment fails?" },
        { question: "What does Cash on Delivery mean?" },
        { question: "Is Cash on Delivery service offered to international clients?" },
        { question: "Can I get a refund?" }
      ]
    },
    {
      title: "DELIVERY",
      items: [
        { question: "Do you ship internationally?" },
        { question: "Are the prices inclusive of delivery charges?" },
        { question: "How are the delivery charges calculated for international orders?" }
      ]
    },
    {
      title: "SECURITY",
      items: [
        { question: "Is it safe to pay with credit/debit card?" },
        { question: "Is my personal information safe?" }
      ]
    }
  ])

  const toggleQuestion = (sectionIndex: number, questionIndex: number) => {
    setSections(prevSections => {
      const newSections = [...prevSections]
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        items: newSections[sectionIndex].items.map((item, idx) => ({
          ...item,
          isOpen: idx === questionIndex ? !item.isOpen : false
        }))
      }
      return newSections
    })
  }

  return (
   <>
   <Header />
   <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold text-center mb-8">FAQ's</h1>
      
      <div className="space-y-8">
        {sections.map((section, sectionIndex) => (
          <div key={section.title} className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            
            <div className="space-y-4">
              {section.items.map((item, questionIndex) => (
                <div key={item.question} className="border rounded-lg">
                  <button
                    className="w-full text-left px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                    onClick={() => toggleQuestion(sectionIndex, questionIndex)}
                  >
                    <span className="font-medium text-gray-800">{item.question}</span>
                    <svg
                      className={`w-5 h-5 transition-transform ${item.isOpen ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  
                  {item.isOpen && item.answer && (
                    <div className="px-4 py-3 bg-gray-50 border-t">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
   <Footer />
   </>
  )
} 